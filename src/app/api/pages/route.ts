"use server";

import { NextRequest, NextResponse } from 'next/server';
import { Page, fetchAll } from "@/app/lib/models/page";

import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {

  // const session = await auth(req, res);
  const session = await auth();

  console.log('session:', session?.user);

  if (session?.user == undefined) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 })
  }

  try {
    const pages = await fetchAll();
    return NextResponse.json(pages);
  } catch (err) {
    console.error('Error occurred during fetchAll:', err);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
};