"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface UserWithDetails {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  birthDate: string | null
  phone: string | null
  cpf: string | null
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  Address: {
    id: string
    street: string
    number: string
    complement: string | null
    neighborhood: string
    city: string
    state: string
    isDefault: boolean
    cep: string
  }[]
  Order: {
    id: string
    total: number
    status: string
    createdAt: Date
  }[]
  _count: {
    Order: number
  }
}

export async function getAllUsers(page = 1, limit = 10, search?: string) {
  try {
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          Address: true,
          Order: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          _count: {
            select: {
              Order: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    throw new Error("Erro ao buscar usuários")
  }
}

export async function getUserById(id: string): Promise<UserWithDetails | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Address: {
          orderBy: { isDefault: "desc" },
        },
        Order: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            Order: true,
          },
        },
      },
    })

    return user
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }
}

export async function toggleUserAdminStatus(userId: string, isAdmin: boolean) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
    })

    revalidatePath("/admin")
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Erro ao alterar status de admin:", error)
    return { success: false, message: "Erro ao alterar status de admin" }
  }
}

export async function deleteUser(userId: string) {
  try {
    // Verificar se o usuário tem pedidos
    const userWithOrders = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            Order: true,
          },
        },
      },
    })

    if (!userWithOrders) {
      return { success: false, message: "Usuário não encontrado" }
    }

    if (userWithOrders._count.Order > 0) {
      return {
        success: false,
        message: "Não é possível excluir usuário com pedidos. Desative-o em vez disso.",
      }
    }

    // Deletar endereços primeiro
    await prisma.address.deleteMany({
      where: { userId },
    })

    // Deletar usuário
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin")
    return { success: true, message: "Usuário excluído com sucesso" }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return { success: false, message: "Erro ao excluir usuário" }
  }
}

export async function getUserStats() {
  try {
    const [totalUsers, newUsersThisMonth, adminUsers, usersWithOrders] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.user.count({
        where: { isAdmin: true },
      }),
      prisma.user.count({
        where: {
          Order: {
            some: {},
          },
        },
      }),
    ])

    return {
      totalUsers,
      newUsersThisMonth,
      adminUsers,
      usersWithOrders,
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas de usuários:", error)
    throw new Error("Erro ao buscar estatísticas de usuários")
  }
}
