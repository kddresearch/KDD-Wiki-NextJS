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
import { AccessLevel } from "@/app/lib/models/user";

async function GET (
  req: NextRequest
) {
  const authUser = await checkAuthAPI(AccessLevel.Admin);
  const url = req.nextUrl.searchParams.get("url");
  let custom_url;

  if (!url) {
    const custom_urls = await fetchAll();
    return NextResponse.json(custom_urls);
  }

  try {

    custom_url = await fetchByURL(url);
  } catch (err) {
    console.error("Error occurred during fetchAll:", err);
    return NextResponse.json(
      { error: "Failed to fetch custom urls" },
      { status: 500 },
    );
  }

  if (custom_url == undefined) {
    return NextResponse.json(
      { error: "Custom URL not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(custom_url);
};

async function POST (
  req: NextRequest
) {
  const authUser = await checkAuthAPI(AccessLevel.Admin);
  let custom_url;

  // Try to parse the request body
  try {
    const body = await req.json();
    custom_url = new CustomUrl(body);
  } catch (err) {
    console.error("Error occurred during req.json:", err);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }

  let existingCustomUrl;
  try {
    existingCustomUrl = await fetchByURL(custom_url.url);
  } catch (err) {
    console.error("Error occurred during fetchByURL:", err);
    return NextResponse.json(
      { error: "Failed to fetch custom url" },
      { status: 500 },
    );
  }

  
  if (existingCustomUrl !== null) {
    return NextResponse.json(
      { error: "Custom URL with URL already exists" },
      { status: 409 },
    );
  }

  let ret_custom_url;

  try {
    const ret_custom_url = await insert(custom_url);
  } catch (err) {
    console.error("Error occurred during insert:", err);
    return NextResponse.json(
      { error: "Failed to insert custom url" },
      { status: 500 },
    );
  }

  return NextResponse.json(ret_custom_url);
};

async function PUT (
  req: NextRequest
) {
  const authUser = await checkAuthAPI(AccessLevel.Admin);

  let custom_url;

  try {
    custom_url = await update(new CustomUrl(req.body));
  } catch (err) {
    console.error("Error occurred during update:", err);
    return NextResponse.json(
      { error: "Failed to update custom url" },
      { status: 500 },
    );
  }

  
  return NextResponse.json(custom_url);
};

async function DELETE (
  req: NextRequest
) {
  const authUser = await checkAuthAPI(AccessLevel.Admin);
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL not provided" },
      { status: 400 },
    );
  }

  let custom_url;

  try {
    custom_url = await fetchByURL(url);
  } catch (err) {
    console.error("Error occurred during fetchByURL:", err);
    return NextResponse.json(
      { error: "Failed to fetch custom url" },
      { status: 500 },
    );
  }

  if (custom_url === null) {
    return NextResponse.json(
      { error: "Custom URL not found" },
      { status: 404 },
    );
  }

  let result;

  try {
    result = await remove(custom_url);
  } catch (err) {
    console.error("Error occurred during delete:", err);
    return NextResponse.json(
      { error: "Failed to delete custom url" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: result });
};

export {
  GET,
  POST,
  PUT,
  DELETE,
}