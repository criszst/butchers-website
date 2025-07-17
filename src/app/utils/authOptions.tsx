import CredentialsProvider from "next-auth/providers/credentials"

import prisma from '@/lib/prisma'
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: "Name", type: "name" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Credenciais inválidas.")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas.")
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)
        if (!isCorrectPassword) {
          throw new Error("Senha incorreta.")
        }

        return user
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, id: token.id ?? user?.id };
    },

    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.id } };
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    }
  }
}
