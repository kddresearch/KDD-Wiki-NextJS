"use server";

import { NextRequest, NextResponse } from 'next/server';
import { CustomUrl, fetchByURL, fetchAll, insert, update, remove } from "@/app/lib/models/custom_url";

import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {

  // const session = await auth(req, res);
  // Checking cookies for API auth
  var session = await auth();
  if (session?.user == undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = req.query['url']
    if (url) {
      const custom_url = await fetchByURL(url as string);

      if (custom_url == undefined) {
        return NextResponse.json({ error: 'Custom URL not found' }, { status: 404 });
      }
      return NextResponse.json(custom_url);
    }


    const custom_urls = await fetchAll();
    return NextResponse.json(custom_urls);
  } catch (err) {
    console.error('Error occurred during fetchAll:', err);
    return NextResponse.json({ error: `Failed to fetch custom urls ${err}` }, { status: 500 });
  }
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {

  // const session = await auth(req, res);
  // Checking cookies for API auth
  var session = await auth();
  if (session?.user == undefined) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 })
  }

  try {
    const custom_url = await insert(new CustomUrl(req.body));
    return NextResponse.json(custom_url);
  } catch (err) {
    console.error('Error occurred during insert:', err);
    return NextResponse.json({ error: 'Failed to insert custom url' }, { status: 500 });
  }
};

export const PUT = async (req: NextApiRequest, res: NextApiResponse) => {

  // const session = await auth(req, res);
  // Checking cookies for API auth
  var session = await auth();
  if (session?.user == undefined) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 })
  }

  try {
    const custom_url = await update(new CustomUrl(req.body));
    return NextResponse.json(custom_url);
  } catch (err) {
    console.error('Error occurred during update:', err);
    return NextResponse.json({ error: 'Failed to update custom url' }, { status: 500 });
  }
};

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {

  // const session = await auth(req, res);
  // Checking cookies for API auth
  var session = await auth();
  if (session?.user == undefined) {
    return NextResponse.json({ error: 'Unauthorized', status: 401 })
  }

  try {
    const custom_url = await remove(new CustomUrl(req.body));
    return NextResponse.json(custom_url);
  } catch (err) {
    console.error('Error occurred during delete:', err);
    return NextResponse.json({ error: 'Failed to delete custom url' }, { status: 500 });
  }
};