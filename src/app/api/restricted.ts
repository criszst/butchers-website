import {getServerSession } from "next-auth/next"

import { AuthOptions } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    res.send({
      content: '404 haha /s'
    })
  }

  res.send({
    content: 'Você precisa estar logado.'
  })
}