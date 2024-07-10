"use server";

import { NextRequest, NextResponse } from "next/server";
import { query } from '@/app/lib/db';
import { fetchAll as fetchAllPages } from "@/app/lib/db/rpage";
import { fetchAll as fetchAllDirectories } from "@/app/lib/db/directory";
import Directory from '@/app/lib/models/directory';
import rPage from '@/app/lib/models/rpage';

async function fetchDirectories(): Promise<(Directory & { type: string })[]> {
  const query_str = `
    SELECT id, created_at, modified_at, title
    FROM directory;
  `;

  try {
    const result = await query(query_str);
    return result.rows.map((row: any) => ({
      ...row,
      type: 'directory'
    }));
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

async function fetchPages(): Promise<(rPage & { type: string })[]> {
  const query_str = `
    SELECT id, created_at, modified_at, title, content, endpoint, page_type
    FROM rpage;
  `;

  try {
    const result = await query(query_str);
    return result.rows.map((row: any) => ({
      ...row,
      type: 'rpage'
    }));
  } catch (err) {
    console.error("Error occurred during query execution:", err);
    throw err;
  }
}

export async function GET(req: NextRequest) {
  try {
    const directories = await fetchAllDirectories();
    const pages = await fetchAllPages();
    const data = [...directories, ...pages];
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching directories and pages:', error);
    return NextResponse.json({ message: 'Failed to fetch directories and pages' }, { status: 500 });
  }
}
