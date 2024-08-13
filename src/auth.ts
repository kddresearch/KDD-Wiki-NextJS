import NextAuth, { Profile, User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import getConfig from "@/config";
const env_config = await getConfig();

import google from "next-auth/providers/google";
import LegacyUser from "@/models/legacy-user";
import Auth0 from "next-auth/providers/auth0"
import { AdapterUser } from "next-auth/adapters";
import type { Provider } from "next-auth/providers"
import { OIDCConfig } from "next-auth/providers";

const providers: Provider[] = [
    Auth0({
        authorization: {
            params: {
                prompt: "login",
                access_type: "offline",
                response_type: "code"
            }
        }
    }),
    {
        id: "ksu",
        name: "K-State",
        type: "oidc",
        issuer: env_config!.Auth!.Ksu.Issuer,
        clientId: env_config!.Auth!.Ksu.ClientId,
        clientSecret: env_config!.Auth!.Ksu.ClientSecret,
        // checks: ["none"], //TODO - Add PKCE Back in
        profile(profile) {
            console.log(profile);
            return {
                username: profile?.preferred_username,
                id: profile.id,
                name: profile?.name,
            };
        },
        authorization: {
            params: {
                prompt: "login",
                response_type: "code",
                scope: "openid profile email preferred_username",
            },
        },
        wellKnown: 'https://signin.k-state.edu/WebISO/oidc/.well-known',
    } as OIDCConfig<Profile>,
];
 
export const config = {
    trustHost: true,
    pages: {
        error: "/notauthorized",
    },
    basePath: "/auth",
    providers: providers,
    callbacks: {
        async signIn({ user, account, profile }) {
            // Check if user is in the database

            

            console.log("signIn", user, account, profile);
            return true;
        },
        async redirect({ url, baseUrl }) {
            console.log("redirect", url, baseUrl)
            return url;
        },
        async session({ session, token, user }) {
            console.log("session", session, token, user);

            const kddUser = token.kdd_user as AdapterUser & User;

            session.user = {
              ...kddUser,
            };

            return session;
        },
        authorized({ request, auth }) {
            console.log("authorized", request, auth);
            return true;
        },
        jwt({ token, trigger, session }) {
            console.log("jwt", token, trigger, session);

            if (trigger === "signIn") {
                console.log("Sign In Triggered", token);
            }

            const devUserData = env_config!.dev_user;
            console.log("devUserData", devUserData);

            console.log("devUser", deepJsonCopy(new LegacyUser(devUserData)));

            token!.kdd_user = deepJsonCopy(new LegacyUser(devUserData));

            if (trigger === "update") token.name = session.user.name;
            return token;
        },
    },
    secret: env_config!.Auth!.Secret,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

/**
 * Gets the current user from the session
 * @returns {LegacyUser} - The current user
 */
export async function getCurrentUser(): Promise<LegacyUser> {
    const session = await auth();

    if (!session) return LegacyUser.guestFactory();

    // TODO: Implement fetching user from the database
    return LegacyUser.guestFactory();
}

import WikiUser, { AccessLevel } from "@/models/wikiuser";
import { fetchByUsername } from "@/db/wiki_user";
import { deepJsonCopy } from "./utils/json";

/**
 * Check if the user is authenticated
 * @param admin - check if the user is an admin
 * @param member - check if the user is a member
 * Sends a 401 error if the user is not authenticated
 */
export async function checkAuthAPI(access_level: AccessLevel): Promise<LegacyUser | WikiUser> /* TODO: FIX ANY TYPE */ {
    const session = await auth();

    let user;
    let ret_user;

    if (!session) {
        throw { status: 401, message: "Unauthorized" };
    }

    try {
        user = new LegacyUser(session?.user);

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
        user = new LegacyUser(session?.user);

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
