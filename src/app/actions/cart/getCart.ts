"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function getCartItems() {
  const session = await getServerSession()
  const userId = session?.user?.email

  if (!userId) return []

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })

  return items
}
