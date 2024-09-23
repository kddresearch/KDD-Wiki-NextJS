"use server";

import getConfig from "@/config";

async function getPublicConfig() {
    const config = await getConfig;
    return config!.Public;
}

export default getPublicConfig;
