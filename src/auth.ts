import NextAuth, { User } from "next-auth"
import { NextAuthConfig } from "next-auth"
import { NextRequest, NextResponse } from 'next/server';

import config_json from "@/config.json"

import google from "next-auth/providers/google"
import KddUser from "@/app/lib/models/kdd_user"
import { OAuthUserConfig } from "next-auth/providers"
import type { OAuth2Config } from "next-auth/providers"
import type { OIDCConfig } from "@auth/core/providers"
import { AdapterUser } from "next-auth/adapters"

export const config = {
  providers: [
    {
      id: "ksu",
      name: "K-State",
      type: "oidc",
      issuer: config_json.auth.ksu.issuer,
      clientId: config_json.auth.ksu.client_id,
      clientSecret: config_json.auth.ksu.client_secret,
      profile(profile) {
        console.log(profile);
        return {
          id: profile.id,
          name: profile?.name,
        };
      },
      authorization: {
        params: {
          scope: "email openid profile",
        },
      },
      wellKnown: config_json.auth.ksu.well_known,
    },
    google({ clientId: config_json.auth.google.client_id, clientSecret: config_json.auth.google.client_secret })
  ],
  basePath: "/auth",
  callbacks: {
    async signIn({user, account, profile}) {
      // console.log("signIn", user, account, profile)
      return true
    },
    async redirect({url, baseUrl}) {
      // console.log("redirect", url, baseUrl)
      return url
    },
    async session({session, token, user}) {

      session.userId = session.user.email.split("@")[0];

      const kddUser = token.kdd_user as AdapterUser & User;

      session.user = {
        // ...session.user,
        ...kddUser,
      };

      return session
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {

      // console.log("jwt", token)
      const devUserData = config_json.dev_user

      token!.kdd_user = new KddUser(devUserData).toJSON()

      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
  secret: config_json.auth.secret,
  session: { strategy: "jwt" },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

// get current user from the database

export async function getCurrentUser(): Promise<KddUser> {
  const session = await auth()

  if (!session) return KddUser.guestFactory();

  return KddUser.guestFactory();

  // return session?.user?.id
}

import { AccessLevel } from "./app/lib/models/rkdd_user";

/**
 * Check if the user is authenticated
 * @param admin - check if the user is an admin
 * @param member - check if the user is a member
 * Sends a 401 error if the user is not authenticated
 */
export async function checkAPIAuth(access_level: AccessLevel): Promise<any> {
  const session = await auth()

  if (!session) return NextResponse.json({ error: 'Unauthorized', status: 401 });

  const user = new KddUser(session?.user);

  if ((access_level == AccessLevel.Admin) && !user.admin) return NextResponse.json({ error: 'Unauthorized', status: 403 });

  if ((access_level == AccessLevel.Member) && !user.member) return NextResponse.json({ error: 'Unauthorized', status: 403 });

  console.log(user);

  return user;
}