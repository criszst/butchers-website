"use server"

import { revalidatePath } from "next/cache"


interface AdditionalUserDetails {
  phone?: string | null
  bio?: string | null

  // cpf?: string | null
}

// Chave é o email do usuário, valor são os AdditionalUserDetails
const mockDatabase = new Map<string, AdditionalUserDetails>()

// Seed com alguns dados mock para um usuário
mockDatabase.set("user@example.com", {
  phone: "11987654321",
  bio: "Entusiasta de churrasco e amante de carnes nobres.",
  // cpf: "123.456.789-00",
})

export async function getUserProfileDetails(userEmail: string): Promise<AdditionalUserDetails> {
  // Simular busca no banco de dados com delay
  await new Promise((resolve) => setTimeout(resolve, 10))
  console.log(`[Server Action] Buscando detalhes do perfil para usuário: ${userEmail}`)
  return mockDatabase.get(userEmail) || { phone: "", bio: "",}
}

export async function updateUserProfileDetails(userEmail: string, data: Partial<AdditionalUserDetails>) {
  // Simular atualização no banco de dados com delay
  await new Promise((resolve) => setTimeout(resolve, 10))

  console.log(`[Server Action] Atualizando detalhes do perfil para usuário: ${userEmail} com dados:`, data)
 
  mockDatabase.set(userEmail, { ...mockDatabase.get(userEmail), ...data })

  revalidatePath("/profile") // Revalidar a página do perfil após atualização
  
  return { success: true, message: "Perfil atualizado com sucesso!" }
}
