"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function toggleFavorite(productId: number) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { success: false, message: "Usuário não autenticado" }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, message: "Usuário não encontrado" }
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    })

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId,
          },
        },
      })

      revalidatePath("/")
      revalidatePath("/profile")
      return { success: true, message: "Produto removido dos favoritos", isFavorite: false }
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId: user.id,
          productId: productId,
        },
      })

      revalidatePath("/")
      revalidatePath("/profile")
      return { success: true, message: "Produto adicionado aos favoritos", isFavorite: true }
    }
  } catch (error) {
    console.error("Erro ao alterar favorito:", error)
    return { success: false, message: "Erro interno do servidor" }
  }
}

export async function getUserFavorites() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { success: false, favorites: [] }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, favorites: [] }
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return {
      success: true,
      favorites: favorites.map((fav) => fav.product),
    }
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error)
    return { success: false, favorites: [] }
  }
}

export async function checkIsFavorite(productId: number) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return false
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return false
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    })

    return !!favorite
  } catch (error) {
    console.error("Erro ao verificar favorito:", error)
    return false
  }
}
