import { NextRequest, NextResponse } from "next/server";

import { checkAuthAPI } from "@/auth";
import { AccessLevel } from "@/app/lib/models/wikiuser";
import { handleAPIError } from "@/app/lib/utils/api";
// import { WikiContainerServiceClient } from "@/app/lib/files";
import configProxy from "@/config";
import { getFile, getFilesFromFormData, uploadFile } from "@/app/lib/files";

export async function GET(
    req: NextRequest,
    { params }: { params: { filename: string[] } }
) {
    const filename = params.filename[params.filename.length - 1];
    const filepath = params.filename.join("/");

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        if (!filepath)
            throw { status: 400, message: "No filepath specified" };

        const downloadResponse = await getFile(filepath);
        // ME WHEN I HATE TYPE ERRORS
        // TODO: Fix Type Error
        const readableStream = downloadResponse.readableStreamBody! as unknown as ReadableStream<Uint8Array>;
        const totalSize = downloadResponse.contentLength!;
        let contentType = downloadResponse.contentType!;

        if (!readableStream)
            throw { status: 500, message: "Failed to create readable stream with progress" };
        const response = new NextResponse(readableStream);

        const extension = filepath.split(".").pop()!;
        let filetypeToContentType: Record<string, string> = {
            "pdf": "application/pdf",
            "txt": "text/plain",
            "md": "text/markdown",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",        
        }
        contentType = filetypeToContentType[extension] || contentType;
        response.headers.set("Content-Type", contentType || "application/octet-stream" );
        response.headers.set("Content-Length", totalSize.toString());

        return response;
    } catch (err) { 
        console.error("Error occurred during GET File route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

// Submit as a form!
export async function POST(
    req: NextRequest,
    { params }: { params: { filename: string[] } }
) {
    const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${req.headers.get('host')}` 
    : 'http://localhost:3000';
    const path = params.filename.join("/");
    console.log(path);

    try {
        const authUser = await checkAuthAPI(AccessLevel.Admin);

        if (!path)
            throw { status: 400, message: "No path specified" };

        if (path.match(/\./)) // if there is a . in the filepath, it is a file, not a directory
            throw { status: 400, message: "Path must be a directory" }

        let files = getFilesFromFormData(await req.formData());

        const fileResponse = [];
        for (const file of files) {
            if (!file)
                throw { status: 400, message: "No file uploaded specified" };

            const filepath = path + "/" + file.name;
            const response = await uploadFile(filepath, file);

            const md5Hex = Buffer.from(response.contentMD5!).toString("hex");
            fileResponse.push({ 
                filename: filepath, 
                md5: md5Hex, 
                size: file.size, 
                type: file.type, 
                hostedLink: `${baseUrl}/api/file/${filepath}` 
            });
        }

        return NextResponse.json({ success: true, files: fileResponse});
    } catch (err) {
        console.error("Error occurred during POST File route:", err);
        const [{ error }, { status }] = handleAPIError(err);
        return NextResponse.json({ error }, { status });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { filename: string[] } }
) {
    const filepath = params.filename.join("/");
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { filename: string[] } }
) {
    const filepath = params.filename.join("/");
}