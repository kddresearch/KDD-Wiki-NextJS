"use server";

import { NextRequest, NextResponse } from "next/server";
import { fetchTopLevelDirectories } from "@/app/lib/db/directory"; // Adjust the path as needed
import { handleAPIError } from "@/app/lib/utils/api";

export async function GET(req: NextRequest) {
  try {
    const directories = await fetchTopLevelDirectories();
    return NextResponse.json(directories);
  } catch (err) {
    console.error("Error occurred during GET top-level directories route:", err);
    const [{ error }, { status }] = handleAPIError(err);
    return NextResponse.json({ error }, { status });
  }
}
