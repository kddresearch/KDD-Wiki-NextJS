import NextAuth, { User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import getConfig from "@/config";
const env_config = await getConfig();

import google from "next-auth/providers/google";
import KddUser from "@/models/kdd_user";
import { OAuthUserConfig } from "next-auth/providers";
import type { OAuth2Config } from "next-auth/providers";
import type { OIDCConfig } from "@auth/core/providers";
import { AdapterUser } from "next-auth/adapters";

export const config = {
  trustHost: true,
  providers: [
    {
      id: "ksu",
      name: "K-State",
      type: "oidc",
      issuer: env_config!.Auth!.Ksu.Issuer,
      clientId: env_config!.Auth!.Ksu.ClientId,
      clientSecret: env_config!.Auth!.Ksu.ClientSecret,
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
      wellKnown: env_config!.Auth!.Ksu.WellKnown,
    },
    google({
      clientId: env_config!.Auth!.Google.ClientId,
      clientSecret: env_config!.Auth!.Google.ClientSecret,
    }),
  ],
  basePath: "/auth",
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      // console.log("redirect", url, baseUrl)
      return url;
    },
    async session({ session, token, user }) {
      session.userId = session.user.email.split("@")[0];

      const kddUser = token.kdd_user as AdapterUser & User;

      session.user = {
        // ...session.user,
        ...kddUser,
      };

      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt({ token, trigger, session }) {
      const devUserData = env_config!.dev_user;

      token!.kdd_user = new KddUser(devUserData).toJSON();

      if (trigger === "update") token.name = session.user.name;
      return token;
    },
  },
  secret: env_config!.Auth!.Secret,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

/**
 * Gets the current user from the session
 * @returns {KddUser} - The current user
 */
export async function getCurrentUser(): Promise<KddUser> {
  const session = await auth();

  if (!session) return KddUser.guestFactory();

  // TODO: Implement fetching user from the database
  return KddUser.guestFactory();
}

import WikiUser, { AccessLevel } from "./models/wikiuser";
import { ActivityType } from "./models/user_activity";
import { fetchByUsername } from "./db/wiki_user";

/**
 * Check if the user is authenticated
 * @param admin - check if the user is an admin
 * @param member - check if the user is a member
 * Sends a 401 error if the user is not authenticated
 */
export async function checkAuthAPI(access_level: AccessLevel): Promise<KddUser | WikiUser> /* TODO: FIX ANY TYPE */ {
  const session = await auth();

  let user;
  let ret_user;

  if (!session) {
    throw { status: 401, message: "Unauthorized" };
  }

  try {
    user = new KddUser(session?.user);

    ret_user = await fetchByUsername(user.username);
    if (ret_user === null) {
      ret_user = user;
      // throw { status: 404, error: "User not found" };
    }
  } catch (err) {
    console.error("Error occurred during fetchByUsername:", err);
    throw { status: 500, message: "Failed to fetch user" };
  }


  if (access_level == AccessLevel.Admin && !user.admin)
    throw { status: 403, message: "Unauthorized" };

  if (access_level == AccessLevel.Member && !user.member)
    throw { status: 403, message: "Unauthorized" };

  return ret_user;
}

/**
 * Check if the user is authenticated
 * @param access_level
 * @returns The current user
 */
export async function checkAuth(access_level: AccessLevel): Promise<any> {
  const session = await auth();

  let user;
  let ret_user;

  if (!session) return null;

  try {
    user = new KddUser(session?.user);

    ret_user = await fetchByUsername(user.username);
    if (ret_user === null) {
      ret_user = user;
    }
  } catch (err) {
    console.error("Error occurred during fetchByUsername:", err);
    return null;
  }

  if (access_level == AccessLevel.Admin && !user.admin) return null;

  if (access_level == AccessLevel.Member && !user.member) return null;

  return user;
}
