"use server";

import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

import { checkAPIAuth } from '@/auth';

import { fetchAll, fetchById, fetchByUsername, insert, update, remove } from '@/app/lib/db/rkdd_user';

import { auth } from '@/auth';
import KddUser from '@/app/lib/models/kdd_user';

import { AccessLevel } from '@/app/lib/models/rkdd_user';

export async function GET(req: NextApiRequest, { params }: { params: { id: string } } ) {

    const id = parseInt(params.id);

    const auth_user = await checkAPIAuth(AccessLevel.Admin);

    // if id is not a number
    if (isNaN(id)) {

        try {

            if (params.id === 'self') {

                return NextResponse.json(auth_user);
            }

            const user = await fetchByUsername(params.id);

            if (user === null) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            return NextResponse.json(user);
        } catch (err) {
            console.error('Error occurred during fetchByUsername:', err);
            return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
        }
    }

    try {
        const user = await fetchById(id);

        if (user === null) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error('Error occurred during fetchByUsername:', err);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}