import { NextRequest, NextResponse } from "next/server";

import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/wikiuser";
import { handleAPIError } from "@/app/lib/utils/api";
// import { WikiContainerServiceClient } from "@/app/lib/files";
import configProxy from "@/config";
import { getFile } from "@/app/lib/files";

export async function GET(
    req: NextRequest,
    { params }: { params: { filename: string[] } }
) {
    const filepath = params.filename.join("/");

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        if (!filepath)
            throw { status: 400, message: "No file specified" };

        const downloadResponse = await getFile(filepath);

        // ME WHEN I HATE TYPE ERRORS
        // TODO: Fix Type Error
        const response = new Response(downloadResponse.readableStreamBody as unknown as ReadableStream<any>, {
            headers: {
                'Content-Type': downloadResponse.contentType || 'application/octet-stream',
                'Content-Disposition': `inline; filename="${filepath}"`,
            },
        });

        response.headers.set("Content-Type", downloadResponse.contentType || "application/octet-stream");
        response.headers.set("Content-Disposition", `inline; filename="${filepath}"`);
    
        return response;
    } catch (err) { 
        console.error("Error occurred during GET File route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}