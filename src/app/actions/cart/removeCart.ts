import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function removeFromCart(productId: number) {
  const session = await getServerSession()
  const userId = session?.user?.email
  if (!userId) throw new Error("Usuário não autenticado")

  await prisma.cartItem.delete({
    where: { userId_productId: { userId, productId } },
  })
}