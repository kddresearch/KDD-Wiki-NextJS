"use server";

import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

import { fetchAll, fetchByUsername, insert, update, remove } from '@/app/lib/db/rkdd_user';

import { auth } from '@/auth';
import KddUser from '@/app/lib/models/kdd_user';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    // Checking cookies for API auth
    var session = await auth();
    if (session?.user == undefined) {
        return NextResponse.json({ error: 'Unauthorized', status: 401 });
    }

    const user = new KddUser(session?.user);

    if (!user.admin) {
        return NextResponse.json({ error: 'Unauthorized', status: 403 });
    }
    
    try {
        const users = await fetchAll();
        return NextResponse.json(users);
    } catch (err) {
        console.error('Error occurred during fetchAll:', err);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}