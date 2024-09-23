import NextAuth, { Profile, User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import LegacyUser from "@/models/legacy-user";
import Auth0 from "next-auth/providers/auth0"
import { AdapterUser } from "next-auth/adapters";
import type { Provider } from "next-auth/providers"
import { OIDCConfig } from "next-auth/providers";
import * as LegacyUserDB from "./db/legacy-user";

import getConfig from "@/config";
const env_config = await getConfig;

interface KSUProfile extends Profile {
    preferred_username: string;
    id: string;
};

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
        issuer: env_config!.Auth!.OIDC!.Issuer,
        clientId: env_config!.Auth!.OIDC!.ClientId,
        clientSecret: env_config!.Auth!.OIDC!.ClientSecret,
        profile(profile) {
            console.log('the Profile', profile);
            return {
                id: profile?.preferred_username,
                name: profile?.name,
                email: profile?.email,
                image: profile?.picture,
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
    } as OIDCConfig<KSUProfile>,
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
            console.log(`username`, profile?.sub)

            // console.log("signIn", user, account, profile);
            return true;
        },
        async redirect({ url, baseUrl }) {
            return url;
        },
        async session({ session, token, user }) {
            console.log("session", session, token, user);

            console.log("Fetching user", token.username);

            const start = performance.now();

            const legacyUser = await LegacyUserDB.fetchByUsername(token.username as string) as unknown as AdapterUser & User;
            console.log("Fetched user", legacyUser);

            console.log("Time to fetch user", performance.now() - start);


            session.user = {
              ...legacyUser as AdapterUser & User,
            };

            return session;
        },
        authorized({ request, auth }) {
            console.log("authorized", request, auth);
            return true;
        },
        jwt({ token, user, account, trigger, session }) {
            console.log("jwt", token, user, account, trigger, session);

            if (trigger === "signIn") {
                console.log("Sign In Triggered", token, user, account, trigger, session);

                console.log("User", user);
                console.log("account?.providerAccountId", account?.providerAccountId);

                token = {
                    ...token,
                    username: account?.providerAccountId,
                    version: 2.0,
                }
            }

            // const loadingDevUser = true;

            // const devUserData = env_config!.dev_user;

            token = {
                ...token,
                // ...deepJsonCopy(new LegacyUser(devUserData)),
                // version: loadingDevUser ? 1.0 : 2.0,
            }

            // if (trigger === "update") token.name = session.user.name;
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
import { deepJsonCopy } from "./utils/json";

/**
 * Check if the user is authenticated
 * @param admin - check if the user is an admin
 * @param member - check if the user is a member
 * Sends a 401 error if the user is not authenticated
 */
export async function checkAuthAPI(accessLevel: AccessLevel, req?: NextRequest): Promise<LegacyUser | WikiUser> /* TODO: FIX ANY TYPE */ {
    const session = await auth();

    let user;
    let returnUser;

    if (!session) {
        throw { status: 401, message: "Unauthorized" };
    }

    try {
        console.log('hell guys', session?.user);

        user = new LegacyUser(session?.user);

        returnUser = await LegacyUserDB.fetchByUsername(user.username);
        if (returnUser === null) {
            returnUser = user;
            // throw { status: 404, error: "User not found" };
        }
    } catch (err) {
        console.error("Error occurred during fetchByUsername:", err);
        throw { status: 500, message: "Failed to fetch user" };
    }


    if (accessLevel == AccessLevel.Admin && !user.admin)
        throw { status: 403, message: "Unauthorized" };

    if (accessLevel == AccessLevel.Member && !user.member)
        throw { status: 403, message: "Unauthorized" };

    return returnUser;
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

        ret_user = await LegacyUserDB.fetchByUsername(user.username);
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
