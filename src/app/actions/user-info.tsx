"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Interface para detalhes adicionais do usuário armazenados no banco de dados
interface AdditionalUserDetails {
  phone?: string | null
  bio?: string | null
  birthDate?: string | null
  cpf?: string | null
}

export async function getUserProfileDetails(userEmail: string): Promise<AdditionalUserDetails> {
  try {
    console.log(`[Server Action] Buscando detalhes do perfil para usuário: ${userEmail}`)
    
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        phone: true,
        bio: true,
        birthDate: true,
        cpf: true,
      }
    })

    if (!user) {
      console.log(`[Server Action] Usuário não encontrado no banco de dados: ${userEmail}`)
      return { phone: null, bio: null, birthDate: null, cpf: null }
    }

    return {
      phone: user.phone,
      bio: user.bio,
      birthDate: user.birthDate,
      cpf: user.cpf,
    }
  } catch (error) {
    console.error(`[Server Action] Erro ao buscar detalhes do usuário ${userEmail}:`, error)
    return { phone: null, bio: null, birthDate: null, cpf: null }
  }
}

export async function updateUserProfileDetails(userEmail: string, data: Partial<AdditionalUserDetails>) {
  try {
    console.log(`[Server Action] Atualizando detalhes do perfil para usuário: ${userEmail} com dados:`, data)
    
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        phone: data.phone,
        bio: data.bio,
        birthDate: data.birthDate,
        cpf: data.cpf,
      }
    })

    revalidatePath("/profile")
    return { success: true, message: "Perfil atualizado com sucesso!" }
  } catch (error) {
    console.error(`[Server Action] Erro ao atualizar usuário ${userEmail}:`, error)
    return { success: false, message: "Erro ao atualizar perfil." }
  }
}

export async function checkUserExistsInDatabase(userEmail: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }
    })

    return !!user
  } catch (error) {
    console.error(`[Server Action] Erro ao verificar usuário ${userEmail}:`, error)
    return false
  }
}
