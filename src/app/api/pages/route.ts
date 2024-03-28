"use server";

import { NextRequest, NextResponse } from 'next/server';
import { Page, fetchAll } from "@/app/lib/models/page";

import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {

  // const session = await auth(req, res);
  // Checking cookies for API auth
  var session = await auth();
  if (session?.user == undefined) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 })
  } else {
    // // Checking cookies for API auth
    // session = await auth(req, res)
    // if (session?.user == undefined) {
    //   return NextResponse.json({ error: 'Unauthorized', status: 401 })
    // }
  }

  

  try {
    const pages = await fetchAll();
    return NextResponse.json(pages);
  } catch (err) {
    console.error('Error occurred during fetchAll:', err);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
};