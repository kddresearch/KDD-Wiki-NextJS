"use server";

import { signIn, signOut, auth } from "@/auth";

async function handleSignIn() {
    const provider = "ksu";
    await signIn(provider);
}

async function handleSignOut() {
    await signOut();
}

export { handleSignIn, handleSignOut };