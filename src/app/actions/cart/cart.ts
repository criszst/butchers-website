"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

// Função auxiliar para obter o usuário autenticado
async function getAuthenticatedUser() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    throw new Error("Usuário não autenticado")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  return user
}

// Adicionar item ao carrinho
export async function addToCart(productId: number, quantity = 1) {
  try {
    const user = await getAuthenticatedUser()

    // Verificar se o produto existe e está disponível
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.available) {
      throw new Error("Produto não disponível")
    }

    // Verificar se já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    if (existingItem) {
      // Atualizar quantidade
      await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })
    } else {
      // Criar novo item
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          quantity,
        },
      })
    }

    revalidatePath("/")
    return { success: true, message: "Produto adicionado ao carrinho" }
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor",
    }
  }
}

// Obter itens do carrinho
export async function getCartItems() {
  try {
    const user = await getAuthenticatedUser()

    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            category: true,
            available: true,
            priceWeightAmount: true,
            priceWeightUnit: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Filtrar apenas produtos disponíveis
    const availableItems = items.filter((item) => item.product.available)

    return availableItems
  } catch (error) {
    console.error("Erro ao obter itens do carrinho:", error)
    return []
  }
}

// Atualizar quantidade do item
export async function updateCartItemQuantity(productId: number, quantity: number) {
  try {
    const user = await getAuthenticatedUser()

    if (quantity <= 0) {
      return await removeFromCart(productId)
    }

    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      data: { quantity },
    })

    revalidatePath("/")
    return { success: true, message: "Quantidade atualizada" }
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor",
    }
  }
}

// Remover item do carrinho
export async function removeFromCart(productId: number) {
  try {
    const user = await getAuthenticatedUser()

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    revalidatePath("/")
    return { success: true, message: "Item removido do carrinho" }
  } catch (error) {
    console.error("Erro ao remover do carrinho:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor",
    }
  }
}

// Limpar carrinho
export async function clearCart() {
  try {
    const user = await getAuthenticatedUser()

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    })

    revalidatePath("/")
    return { success: true, message: "Carrinho limpo com sucesso" }
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro interno do servidor",
    }
  }
}

// Obter resumo do carrinho (total e quantidade)
export async function getCartSummary() {
  try {
    const user = await getAuthenticatedUser()

    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            price: true,
            available: true,
          },
        },
      },
    })

    const availableItems = items.filter((item) => item.product.available)

    const total = availableItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const itemCount = availableItems.reduce((sum, item) => sum + item.quantity, 0)

    return { total, itemCount, success: true }
  } catch (error) {
    console.error("Erro ao obter resumo do carrinho:", error)
    return { total: 0, itemCount: 0, success: false }
  }
}
