import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google"

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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 