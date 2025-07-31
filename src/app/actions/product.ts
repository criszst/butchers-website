"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { Prisma, Product } from "@/generated/prisma"

import ProductData from "@/interfaces/product"

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

    // TODO: Price Per Kilo equals to 1 (kg) usually
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
        priceWeightUnit: data.priceWeightUnit
      },
    })

    revalidatePath("/admin")
    revalidatePath("/")

    return {
      success: true,
      message: "Produto criado com sucesso!",
      product,
    }
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput): 
    Promise<{ success: boolean; message: string }> {


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
    await prisma.product.update({
      where: { id },
      data,
    })

    return {
      success: true,
      message: "Produto atualizado com sucesso",
    }

}
export async function deleteProduct(id: number) {
  if (!id) return {
      success: false,
      message: "Nome, descrição e categoria são obrigatórios",
  }

  return await prisma.product.delete({
      where: { id },
    })
}


export async function getProductsAction(filters?: {
  search?: string
  category?: string
}) {

  if(!filters) return {
      success: false,
      products: [],
      message: 'Filtros faltando...',
  }

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

    if (!product) {
      return {
        success: false,
        product: null,
        message: "Produto não encontrado",
      }
    }

    return {
      success: true,
      product,
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
        AND: [
          { id: { not: productId } },
          { category: category }, 
          { available: true },
        ],
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
