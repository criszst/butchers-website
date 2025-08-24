"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

interface KitData {
  name: string
  description: string
  image?: string
  category: string
  discount?: number
  items: Array<{
    productId: number
    quantity: number
  }>
}

export async function createKit(data: KitData) {
  if (!data.name || !data.description || !data.category) {
    return {
      success: false,
      message: "Nome, descrição e categoria são obrigatórios",
    }
  }

  if (!data.items || data.items.length === 0) {
    return {
      success: false,
      message: "O kit deve conter pelo menos um produto",
    }
  }

  try {
    const kit = await prisma.kit.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image || null,
        category: data.category,
        discount: data.discount || 0,
        available: true,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Kit criado com sucesso!",
      kit,
    }
  } catch (error) {
    console.error("Erro ao criar kit:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function updateKit(id: number, data: Partial<KitData>) {
  if (!data.name || !data.description || !data.category) {
    return {
      success: false,
      message: "Nome, descrição e categoria são obrigatórios",
    }
  }

  try {
    // Se items foram fornecidos, atualizar os itens do kit
    if (data.items) {
      // Deletar itens existentes
      await prisma.kitItem.deleteMany({
        where: { kitId: id },
      })

      // Criar novos itens
      await prisma.kitItem.createMany({
        data: data.items.map((item) => ({
          kitId: id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      })
    }

    // Atualizar o kit
    const kit = await prisma.kit.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        category: data.category,
        discount: data.discount,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Kit atualizado com sucesso",
      kit,
    }
  } catch (error) {
    console.error("Erro ao atualizar kit:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function deleteKit(id: number) {
  if (!id) {
    return {
      success: false,
      message: "ID do kit é obrigatório",
    }
  }

  try {
    await prisma.kit.delete({
      where: { id },
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Kit deletado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao deletar kit:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function getKitsAction(filters?: { search?: string; category?: string }) {
  try {
    const where: any = {}

    if (filters?.search) {
      where.OR = [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ]
    }

    if (filters?.category && filters.category !== "all") {
      where.category = filters.category
    }

    const kits = await prisma.kit.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      kits,
    }
  } catch (error) {
    console.error("Erro ao buscar kits:", error)
    return {
      success: false,
      kits: [],
      message: "Erro interno do servidor",
    }
  }
}

export async function getKitById(id: number) {
  try {
    const kit = await prisma.kit.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!kit) {
      return {
        success: false,
        kit: null,
        message: "Kit não encontrado",
      }
    }

    // Calcular preço total do kit
    const totalPrice = kit.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)

    const discountedPrice = kit.discount ? totalPrice - (totalPrice * kit.discount) / 100 : totalPrice

    return {
      success: true,
      kit: {
        ...kit,
        totalPrice,
        discountedPrice,
      },
    }
  } catch (error) {
    console.error("Erro ao buscar kit:", error)
    return {
      success: false,
      kit: null,
      message: "Erro interno do servidor",
    }
  }
}

export async function getKitCategoriesAction() {
  try {
    const categories = await prisma.kit.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    })

    return {
      success: true,
      categories: categories.map((c) => c.category),
    }
  } catch (error) {
    console.error("Erro ao buscar categorias de kits:", error)
    return {
      success: false,
      categories: [],
    }
  }
}

export async function getRecentKits(limit = 4) {
  try {
    const kits = await prisma.kit.findMany({
      where: {
        available: true,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return {
      success: true,
      kits,
    }
  } catch (error) {
    console.error("Erro ao buscar kits recentes:", error)
    return {
      success: false,
      kits: [],
      message: "Erro ao carregar kits recentes",
    }
  }
}
