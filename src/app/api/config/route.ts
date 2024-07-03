import { NextRequest, NextResponse } from "next/server";
import {
    fetchByURL,
    fetchAll,
    insert,
    update,
    remove,
} from "@/app/lib/db/custom_url";
import CustomUrl from "@/app/lib/models/custom_url";

import { checkAuthAPI } from "@/auth";
import Router from "next/navigation";
import { AccessLevel } from "@/app/lib/models/wikiuser";
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";

export async function GET (
    req: NextRequest
) {
    
}