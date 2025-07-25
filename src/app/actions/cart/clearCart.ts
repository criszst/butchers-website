"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function clearCart() {
  const session = await getServerSession()
  const userId = session?.user?.email
  
  if (!userId) throw new Error("Usuário não autenticado")

  await prisma.cartItem.deleteMany({ where: { userId } })
}
