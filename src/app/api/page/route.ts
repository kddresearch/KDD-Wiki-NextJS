"use server";

import { NextRequest, NextResponse } from "next/server";
import { fetchAll, insert } from "@/app/lib/db/page";

import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/rkdd_user";
import Page from "@/app/lib/models/page";

//
// All page routes are protected by the Admin access level
//

export const GET = async (req: NextRequest, res: NextResponse) => {

  var user = checkAuthAPI(AccessLevel.Admin);

  try {
    const pages = await fetchAll();

    // sort by id
    pages.sort((a, b) => a.id - b.id);

    return NextResponse.json(pages);
  } catch (err) {
    console.error("Error occurred during fetchAll:", err);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
};

export async function POST(req: NextRequest) {
  var user = checkAuthAPI(AccessLevel.Admin);
  
  const body = await req.json();
  const page = new Page(body);

  try {
      const return_page = await insert(page);
      return NextResponse.json(return_page);
  } catch (err) {
      console.error("Error occurred during insert:", err);
      return NextResponse.json(
          { error: "Failed to insert page" },
          { status: 500 },
      );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};