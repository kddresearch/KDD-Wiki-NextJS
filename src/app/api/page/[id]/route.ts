import { NextRequest, NextResponse } from "next/server";
import Page from "@/app/lib/models/page";
import { 
    fetchAll,
    fetchAllByCategoryIdsOrNoCategory,
    fetchById,
    fetchByName,
    fetchAllOrderById,
    insert,
    update,
    remove, 
} from "@/app/lib/db/page";
import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/user";

// All page routes are protected by the Admin access level

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const authUser = checkAuthAPI(AccessLevel.Admin);
    params.id = decodeURIComponent(params.id);

    const id = parseInt(params.id);
    if (isNaN(id)) {
        try {
            const page = await fetchByName(params.id);

            if (page === null) {
                return NextResponse.json(
                    { error: "Page not found" },
                    { status: 404 },
                );
            }

            return NextResponse.json(page);
        } catch (err) {
            console.error("Error occurred during fetchByName:", err);
            return NextResponse.json(
                { error: "Failed to fetch page" },
                { status: 500 },
            );
        }
    }

    try {
        const page = await fetchById(id);

        if (page === null) {
            return NextResponse.json(
                { error: "Page not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(page);
    } catch (err) {
        console.error("Error occurred during fetchById:", err);
        return NextResponse.json(
            { error: "Failed to fetch page" },
            { status: 500 },
        );
    }
}


export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    var user = checkAuthAPI(AccessLevel.Admin);
    params.id = decodeURIComponent(params.id);

    let page;
    const id = parseInt(params.id);
    if (isNaN(id)) {
        try {
            page = await fetchByName(params.id);
        } catch (err) {
            console.error("Error occurred during fetchByName:", err);
            return NextResponse.json(
                { error: "Failed to fetch page" },
                { status: 500 },
            );
        }
    } else {
        try {
            page = await fetchById(id);
        } catch (err) {
            console.error("Error occurred during fetchById:", err);
            return NextResponse.json(
                { error: "Failed to fetch page" },
                { status: 500 },
            );
        }
    }

    if (page === null) {
        return NextResponse.json(
            { error: "Page not found" },
            { status: 404 },
        );
    }

    const body = await req.json();
    page.update(new Page(body));

    try {
        const return_page = await update(page);
        return NextResponse.json(return_page);
    } catch (err) {
        console.error("Error occurred during update:", err);
        return NextResponse.json(
            { error: "Failed to update page" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
) {

    var user = checkAuthAPI(AccessLevel.Admin);
    params.id = decodeURIComponent(params.id);

    let page;
    const id = parseInt(params.id);
    if (isNaN(id)) {
        try {
            page = await fetchByName(params.id);
        } catch (err) {
            console.error("Error occurred during fetchByName:", err);
            return NextResponse.json(
                { error: "Failed to fetch page" },
                { status: 500 },
            );
        }
    } else {
        try {
            page = await fetchById(id);
        } catch (err) {
            console.error("Error occurred during fetchById:", err);
            return NextResponse.json(
                { error: "Failed to fetch page" },
                { status: 500 },
            );
        }
    }

    if (page === null) {
        return NextResponse.json(
            { error: "Page not found" },
            { status: 404 },
        );
    }

    try {
        await remove(page);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error occurred during delete:", err);
        return NextResponse.json(
            { error: "Failed to delete page" },
            { status: 500 },
        );
    }

}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "1mb",
        },
    },
};