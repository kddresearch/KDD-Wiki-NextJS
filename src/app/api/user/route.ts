import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

import {
  fetchAll,
  fetchById,
  fetchByUsername,
  insert,
  update,
  remove,
} from "@/app/lib/db/rkdd_user";

import { auth } from "@/auth";
import KddUser from "@/app/lib/models/kdd_user";
import { AccessLevel } from "@/app/lib/models/user";
import User from "@/app/lib/models/user";

// export async function name(params:type) {
  
// }

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 5,
}