"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

interface CreateAddressInput {
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
  cep: string
  isDefault?: boolean
}

export async function createAddress(addressData: CreateAddressInput) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { success: false, message: "Usuário não autenticado." }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return { success: false, message: "Usuário não encontrado." }
    }

    // Se for endereço padrão, remover padrão dos outros
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        name: addressData.name,
        street: addressData.street,
        number: addressData.number,
        complement: addressData.complement,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        cep: addressData.cep,
        isDefault: addressData.isDefault || false,
      },
    })

    revalidatePath("/perfil") // Revalidar path onde endereços podem ser listados
    return { success: true, address }
  } catch (error) {
    console.error("Erro ao criar endereço:", error)
    return { success: false, message: "Erro interno do servidor ao criar endereço." }
  }
}

export async function getUserAddresses() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return { success: false, addresses: [] }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        Address: {
          orderBy: { isDefault: "desc" }, // Order by default first
        },
      },
    })

    if (!user) {
      return { success: false, addresses: [] }
    }

    return { success: true, addresses: user.Address }
  } catch (error) {
    console.error("Erro ao buscar endereços:", error)
    return { success: false, addresses: [] }
  }
}

export async function updateAddress(data: {
  id: string
  name?: string
  street?: string
  number?: string
   complement?: string | null
  neighborhood?: string
  city?: string
  state?: string
  country?: string
  cep?: string
  isDefault?: boolean
}) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return { success: false, message: "Não autenticado" }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { success: false, message: "Usuário não encontrado" }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    await prisma.address.update({
      where: { id: data.id, userId: user.id },
      data: {
        name: data.name,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: data.country,
        cep: data.cep,
        isDefault: data.isDefault,
      },
    })
    revalidatePath("/perfil")
    return { success: true, message: "Endereço atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error)
    return { success: false, message: "Erro interno do servidor ao atualizar endereço." }
  }
}

export async function deleteAddress(id: string) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) return { success: false, message: "Não autenticado" }
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return { success: false, message: "Usuário não encontrado" }

    await prisma.address.delete({ where: { id, userId: user.id } })
    revalidatePath("/perfil")
    return { success: true, message: "Endereço excluído com sucesso!" }
  } catch (error) {
    console.error("Erro ao excluir endereço:", error)
    return { success: false, message: "Erro interno do servidor ao excluir endereço." }
  }
}

