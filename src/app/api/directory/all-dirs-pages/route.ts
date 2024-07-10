"use server";

import { NextRequest, NextResponse } from "next/server";
import { fetchAll as fetchAllPages } from "@/app/lib/db/rpage";
import { fetchAll as fetchAllDirectories } from "@/app/lib/db/directory";

import Directory from '@/app/lib/models/directory';
import rPage from '@/app/lib/models/rpage';

export async function GET(req: NextRequest) {
  try {
    const directories = await fetchAllDirectories();
    const pages = await fetchAllPages();

    // Add type field to each item
    const directoriesWithType = directories.map((directory: Directory) => ({
      ...directory,
      type: 'directory',
    }));

    const pagesWithType = pages.map((page: rPage) => ({
      ...page,
      type: 'rpage',
    }));

    const data = [...directoriesWithType, ...pagesWithType];
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching directories and pages:', error);
    return NextResponse.json({ message: 'Failed to fetch directories and pages' }, { status: 500 });
  }
}
