"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma"
import type ProductData from "@/interfaces/product"

function calculateUnitPrice(product: any) {
  if (!product.priceWeightAmount || !product.priceWeightUnit) return product.price

  // converte para kg
  const amountInKg =
    product.priceWeightUnit === "g"
      ? product.priceWeightAmount / 1000
      : product.priceWeightAmount

  return product.price / amountInKg
}


export async function createProduct(data: ProductData) {
  if (!data.name || !data.description || !data.category) {
    return {
      success: false,
      message: "Nome, descrição e categoria são obrigatórios",
    }
  }

  if (data.price <= 0) {
    return {
      success: false,
      message: "O preço deve ser maior que zero",
    }
  }

  if (data.stock < 0) {
    return {
      success: false,
      message: "O estoque não pode ser negativo",
    }
  }

  if (!data.priceWeightAmount || data.priceWeightAmount <= 0) {
    return {
      success: false,
      message: "A quantidade da unidade de peso deve ser maior que zero",
    }
  }

  if (!data.priceWeightUnit || !["g", "kg"].includes(data.priceWeightUnit)) {
    return {
      success: false,
      message: "A unidade de peso deve ser 'g' ou 'kg'",
    }
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image: data.image || null,
        available: true,
        priceWeightAmount: data.priceWeightAmount,
        priceWeightUnit: data.priceWeightUnit,
        discount: data.discount || 0,
      },
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Produto criado com sucesso!",
      product,
    }
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function updateProduct(
  id: number,
  data: Prisma.ProductUpdateInput,
): Promise<{ success: boolean; message: string }> {
  if (!data.name || !data.description || !data.category) {
    return {
      success: false,
      message: "Nome, descrição e categoria são obrigatórios",
    }
  }

  if (data.price !== undefined && data.price !== null) {
    const priceNumber = Number(data.price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return {
        success: false,
        message: "O preço deve ser um número maior que zero",
      }
    }
  }

  if (data.stock !== undefined && data.stock !== null) {
    const stockNumber = Number(data.stock)
    if (isNaN(stockNumber) || stockNumber < 0) {
      return {
        success: false,
        message: "O estoque deve ser um número maior ou igual a zero",
      }
    }
  }

  if (data.priceWeightAmount !== undefined && data.priceWeightAmount !== null) {
    const weightAmount = Number(data.priceWeightAmount)
    if (isNaN(weightAmount) || weightAmount <= 0) {
      return {
        success: false,
        message: "A quantidade da unidade de peso deve ser maior que zero",
      }
    }
  }

  if (data.priceWeightUnit !== undefined && data.priceWeightUnit !== null) {
    if (!["g", "kg"].includes(data.priceWeightUnit as string)) {
      return {
        success: false,
        message: "A unidade de peso deve ser 'g' ou 'kg'",
      }
    }
  }

  try {
    await prisma.product.update({
      where: { id },
      data,
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Produto atualizado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function deleteProduct(id: number) {
  if (!id)
    return {
      success: false,
      message: "ID do produto é obrigatório",
    }

  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Produto deletado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function getProductsAction(filters?: {
  search?: string
  category?: string
}) {
  if (!filters)
    return {
      success: false,
      products: [],
      message: "Filtros faltando...",
    }

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

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      products,
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return {
      success: false,
      products: [],
      message: "Erro interno do servidor",
    }
  }
}

export async function getProductCategoriesAction() {
  try {
    const categories = await prisma.product.findMany({
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
    console.error("Erro ao buscar categorias:", error)
    return {
      success: false,
      categories: [],
    }
  }
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    const unitPrice = calculateUnitPrice(product)

    if (!product) {
      return {
        success: false,
        product: null,
        message: "Produto não encontrado",
      }
    }

    return {
      success: true,
      product: {
        ...product,
        unitPrice, // aqui já devolve o preço por kg
      },
    }
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return {
      success: false,
      product: null,
      message: "Erro interno do servidor",
    }
  }
}

export async function getRelatedProducts(productId: number, category: string, limit = 4) {
  try {
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [{ id: { not: productId } }, { category: category }, { available: true }],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      products: relatedProducts,
    }
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error)
    return {
      success: false,
      products: [],
    }
  }
}

export async function getRecentProducts(limit: number = 4) {
  try {
    const products = await prisma.product.findMany({
      where: {
        available: true,
        stock: {
          gt: 0
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return {
      success: true,
      products
    }
  } catch (error) {
    console.error("Erro ao buscar produtos recentes:", error)
    return {
      success: false,
      products: [],
      message: "Erro ao carregar produtos recentes"
    }
  }
}
