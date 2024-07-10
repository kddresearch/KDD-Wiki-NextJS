import { NextRequest, NextResponse } from 'next/server';
import { fetchById, updatePage, deletePage } from '../../../lib/db/rpage';
import { checkAuthAPI } from '../../../../auth';
import { AccessLevel } from '../../../lib/models/wikiuser';
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";
import { query } from "@/app/lib/db";

import rPage from '@/app/lib/models/rpage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = checkAuthAPI(AccessLevel.Admin);
    const page = await fetchById(Number(params.id));

    if (!page) throw { status: 404, message: 'Page not found' };

    return NextResponse.json(page);
  } catch (err) {
    console.error('Error occurred during GET Page route:', err);
    const [{ error }, { status }] = handleAPIError(err);
    return NextResponse.json({ error }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authUser = await checkAuthAPI();

  try {
    const pageId = Number(params.id);
    const existingPage = await fetchById(pageId);

    if (!existingPage) {
      throw { status: 404, message: "Page not found" };
    }

    const { page, parentId, parentType } = await bodyParser(req);
    const validatedPage = new rPage({ ...existingPage, ...page });

    await updatePage(pageId, validatedPage);

    if (parentId && parentType) {
      await query(
        `DELETE FROM menu_item WHERE child_id = $1 AND child_type = 'rpage'`,
        [pageId]
      );
      await query(
        `INSERT INTO menu_item (parent_id, child_id, parent_type, child_type) VALUES ($1, $2, $3, 'rpage')`,
        [parentId, pageId, parentType]
      );
    }

    return NextResponse.json({ message: "Page updated successfully" });
  } catch (err) {
    console.error("Error occurred during PATCH Page route:", err);
    const [{ error }, { status }] = handleAPIError(err);
    return NextResponse.json({ error }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    const page = await fetchById(Number(params.id));

    if (!page) throw { status: 404, message: 'Page not found' };

    await deletePage(page.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error occurred during DELETE Page route:', err);
    const [{ error }, { status }] = handleAPIError(err);
    return NextResponse.json({ error }, { status });
  }
}
