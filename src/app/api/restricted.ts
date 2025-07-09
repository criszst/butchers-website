import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/authOptions"
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (session) {
    return Response.json({ content: "404 haha /s" })
  }

  return Response.json({ content: "Você precisa estar logado." })
}