import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (session) {
    return Response.json({ content: "404 haha /s" })
  }

  return Response.json({ content: "Você precisa estar logado." })
}