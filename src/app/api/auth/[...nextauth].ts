import { Network } from "lucide-react"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/dist/server/api-utils"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      
      if (user) {
        token.id = user.id
      }

      if (account) {
        token.accessToken = account.accessToken
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.acessToken = token.acessToken

      return session
    },

    async redirect({ url, baseUrl}) {
      return baseUrl
    }
  }
}

export default NextAuth(authOptions)