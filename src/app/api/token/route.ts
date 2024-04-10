// THIS IS FOR ADMIN LEVEL ACCESS ONLY
// JWT Tokens are stored in SECURE COOKIES
// and should not be accessible by the client

import { NextRequest, NextResponse } from "next/server";
import { auth,  } from "@/auth";
// import { getToken } from "next-auth/jwt"
// import { getToken } from "@auth/core/jwt";
import config_json from "@/config.json";
// import { getToken } from "next-auth/jwt";

const secret = config_json.auth.secret;

export const GET = async (req: NextRequest, res: NextResponse) => {

    const session = await auth();

    return NextResponse.json(session)
}

    
