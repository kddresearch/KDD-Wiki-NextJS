import { NextRequest, NextResponse } from "next/server";
import Page from "@/app/lib/models/_page";
import { 
    fetchAll,
    fetchAllByCategoryIdsOrNoCategory,
    fetchById,
    fetchByName,
    fetchAllOrderById,
    insert,
    update,
    remove, 
} from "@/app/lib/db/_page";
import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/wikiuser";
import { fetchPage } from "@/app/lib/utils/_page";
import { bodyParser, handleAPIError } from "@/app/lib/utils/api";

// All page routes are protected by the Admin access level

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const authUser = checkAuthAPI(AccessLevel.Admin);
    let page;

    try {
        page = await fetchPage(params.id);

        if (page === null)
            throw { status: 404, message: "Page not found" };

        return NextResponse.json(page);
    } catch (err) {
        console.error("Error occurred during GET Page route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}


export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let page;

    try {
        page = await fetchPage(params.id);

        if (page === null)
            throw { status: 404, message: "Page not found" };

        page.update(await bodyParser(req, Page));
        page = await update(page);

        return NextResponse.json(page);
    } catch (err) {
        console.error("Error occurred during PATCH Page route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const authUser = await checkAuthAPI(AccessLevel.Admin);
    let page;

    try {
        page = await fetchPage(params.id);

        if (page === null)
            throw { status: 404, message: "Page not found" };

        await remove(page);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error occurred during delete:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

// TODO: Find proper api settings
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
// export const config = {
//     api: {
//         bodyParser: {
//             sizeLimit: "1mb",
//         },
//     },
// };