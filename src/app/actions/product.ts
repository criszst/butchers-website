"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { Prisma, Product } from "@/generated/prisma"

interface ProductData {
  name: string
  description: string
  price: number
  category: string
  stock: number
  image?: string
}

export async function createProduct(data: ProductData) {
  try {
    // Validate required fields
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
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return {
      success: false,
      message: "Erro interno do servidor",
    }
  }
}

export async function updateProduct(id: number, data: Prisma.ProductUpdateInput) {
  if (!data.name || !data.description || !data.category) {
    return {
      success: false,
      message: "Nome, descrição e categoria são obrigatórios",
    }
  }

  if (Number(data.price) <= 0) {
    return {
      success: false,
      message: "O preço deve ser maior que zero",
    }
  }
  
  try {
    return await prisma.product.update({
      where: {id},
      data,
    })    
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return {
      success: false,
      message: "Erro ao atualizar produto \n\n" + error
  }
  }
}

export async function deleteProduct(id: number) {
  try {
    return await prisma.product.delete({
      where: { id },
    })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return null
  }
}


export async function getProductsAction(filters?: {
  search?: string
  category?: string
}) {
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
