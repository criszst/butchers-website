import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true, // Certifique-se de selecionar o campo password
              image: true,
            },
          })

          // Se o usuário não existe ou não tem senha (password é null), não pode logar com credenciais
          if (!user || user.password === null) {
            return null
          }

          // Agora que sabemos que user.password não é null, podemos usá-lo com segurança
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                password: null, // Garante que password é null para usuários do Google
              },
            })
          }
        } catch (error) {
          console.error("Error creating user:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id // Corrigir: era token.id = dbUser.id
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Permite redirecionar para URLs dentro do seu domínio
      if (url.startsWith(baseUrl)) {
        return url
      }
      // Permite redirecionar para URLs externas seguras (se necessário, mas geralmente não para login/registro)
      else if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString()
      }
      // Caso contrário, redireciona para a base
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}
