"use server";

import { NextResponse } from 'next/server';
import { Page, fetchAll } from "@/app/lib/models/page";

export const GET = async () => {

  try {
    const pages = await fetchAll();
    return NextResponse.json(pages);
  } catch (err) {
    console.error('Error occurred during fetchAll:', err);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
};