import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { getUserProfile } from "../user-profile"

export async function updateCartItemQuantity(productId: number, quantity: number) {
  const session = await getServerSession()
  const user = await getUserProfile(session?.user?.email as string)
  if (!session?.user) return

  await prisma.cartItem.updateMany({
    where: {
      userId: user.id,
      productId,
    },
    data: { quantity },
  })
}