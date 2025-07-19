import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { Account, User } from "@/generated/prisma"

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
              password: true,
              image: true,
            },
          })


          if (!user || user.password === null) {
            return null
          }

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
      if (!user.email) return false


      const existingUserProvider = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { accounts: true },
      }) as (User & { accounts: Account[] }) | null

      if (account?.provider === "google") {
        if (!existingUserProvider) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image,
              password: null,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                },
              },
            },
          })
        } else {

          const updateImage: Record<string, any> = {}

          if (!existingUserProvider.image && user.image) {
            updateImage.image = user.image
          }

          if (!existingUserProvider.name && user.name) {
            updateImage.name = user.name
          }

          if (Object.keys(updateImage).length > 0) {
            await prisma.user.update({
              where: { email: user.email! },
              data: updateImage,
            })
          }

          const alreadyLinked = existingUserProvider.accounts?.some(
            (acc) => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId
          )

          if (!alreadyLinked) {
            await prisma.account.create({
              data: {
                userId: existingUserProvider.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
              }
            })
          }
        }

      }
      return true
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async redirect({ url, baseUrl }) {

      if (url.startsWith(baseUrl)) {
        return url
      }

      else if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString()
      }

      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/",
    signOut: "/",
    newUser: "/perfil",
  },
  session: {
    strategy: "jwt",
  },
}
