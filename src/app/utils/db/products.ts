import prisma from "@/lib/prisma"

export interface ProductFilters {
  category?: string
  search?: string
  available?: boolean
}

export default async function getProducts(filters?: ProductFilters) {
  try {
    const where: any = {}

    // Filtro por categoria
    if (filters?.category && filters.category !== "todas") {
      where.category = {
        contains: filters.category,
        mode: "insensitive",
      }
    }

    // Filtro por busca
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

    // Filtro por disponibilidade
    if (filters?.available !== undefined) {
      where.available = filters.available
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return products
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}

export async function getProductsByCategory(category: string) {
  try {
    return await prisma.product.findMany({
      where: {
        category: {
          contains: category,
          mode: "insensitive",
        },
        available: true,
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return []
  }
}

export async function getProductById(id: number) {
  try {
    return await prisma.product.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return null
  }
}

export async function getFeaturedProducts(limit = 8) {
  try {
    return await prisma.product.findMany({
      where: {
        available: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    return []
  }
}

export async function getProductCategories() {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      where: {
        available: true,
      },
    })

    return categories.map((item) => item.category)
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}

