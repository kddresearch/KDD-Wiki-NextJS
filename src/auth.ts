import NextAuth from "next-auth"
import { NextAuthConfig } from "next-auth"

import config_json from "@/config.json"

import google from "next-auth/providers/google"

export const config = {
  providers: [
    google({ clientId: config_json.google.client_id, clientSecret: config_json.google.client_secret })
  ],
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
  secret: config_json.auth.secret,
  session: { strategy: "jwt" },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)