"use server";

import getConfig from "@/config";

async function getPublicConfig() {
    const config = await getConfig();
    console.log("pubilc config", config!.public);
    return config!.public;
}

export default getPublicConfig;
