"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

interface CreateAddressInput {
  name: string
  address: string
  isDefault: boolean
}

export async function createAddress(data: CreateAddressInput) {
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

  if (data.isDefault) {
    // Desmarcar qualquer endereço padrão anterior
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    })
  }

  await prisma.address.create({
    data: {
      userId: user.id,
      name: data.name,
      address: data.address,
      isDefault: data.isDefault,
    },
  })

  return { success: true, message: "Endereço criado com sucesso!" }
}

export async function updateAddress(data: {
  id: string
  name: string
  address: string
  isDefault: boolean
}) {

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
    where: { id: data.id },
    data: {
      name: data.name,
      address: data.address,
      isDefault: data.isDefault,
    },
  })
  
  revalidatePath("/perfil")
  return { success: true }
}

export async function deleteAddress(id: string) {
  await prisma.address.delete({ where: { id } })
}


export async function getAddresses() {
  const session = await getServerSession()

  if (!session?.user?.email) return []

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { Address: true },
  })

  return user?.Address || []
}

