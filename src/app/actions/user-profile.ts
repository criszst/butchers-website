"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import type { UpdateProfileData } from "@/interfaces/user"


function removeUndefinedFields<T extends object>(obj: T): { [k: string]: any; } {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  )
}

export async function updateUserProfile(data: UpdateProfileData) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      throw new Error("Usuário não autenticado")
    }

    if (data.birthDate && isNaN(Date.parse(data.birthDate))) {
  throw new Error("Data de nascimento inválida")
}

    const cleanedData = removeUndefinedFields({
      name: data.name,
      bio: data.bio,
      birthDate: data.birthDate,
      phone: data.phone,
      cpf: data.cpf,
      image: data.image,
      updatedAt: new Date(),
    })

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: cleanedData,
    })

    revalidatePath("/profile")

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    throw new Error("Erro ao atualizar perfil")
  }
}

export async function getUserProfile(email: string): Promise<any> {
  if (!email) return null

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        birthDate: true,
        phone: true,
        cpf: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return null
  }
}
