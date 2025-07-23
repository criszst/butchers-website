"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { Prisma, Product } from "@/generated/prisma"

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

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image: data.image || null,
        available: true,
      },
    })

    // Revalidate the admin and home pages
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
