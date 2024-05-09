// import { NextRequest, NextResponse } from "next/server";

// import { checkAuthAPI } from "@/auth";
// import { AccessLevel } from "@/app/lib/models/wikiuser";
// import { handleAPIError } from "@/app/lib/utils/api";
// import { WikiContainerServiceClient } from "@/app/lib/files";
// import configProxy from "@/config";

// // https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
// // function iteratorToStream(iterator: any) {
// //     return new ReadableStream({
// //         async pull(controller) {
// //             const { value, done } = await iterator.next();
// //             if (done) {
// //                 controller.close();
// //             } else {
// //                 controller.enqueue(value);
// //             }
// //         },
// //     });
// // }

// export async function GET(
//     req: NextRequest,
//     params: { filepath: string[] } 
// ) {

//     console.log(params);

//     const filepath = params.filepath.join("/");
//     // const filepath = req.nextUrl.searchParams.get("file");
//     const authUser = checkAuthAPI(AccessLevel.Admin);
//     let file;

//     if (!filepath) {
//         return NextResponse.json({ error: "No file specified" }, { status: 400 });
//     }

//     try {

//         // const containerClient = WikiBlobServiceClient.getContainerClient(configProxy.blob_storage.container_name);
//         const containerClient = WikiContainerServiceClient;
//         const blobClient = containerClient.getBlobClient(filepath);
    
//         const downloadResponse = await blobClient.download();
//         const stream = downloadResponse.readableStreamBody;

//         if (!stream) {
//           return NextResponse.json({ error: "Blob not found" }, { status: 404 });
//         }
    
//         // const response = new Response(iteratorToStream(stream));

//         // ME WHEN I HATE TYPE ERRORS
//         // TODO: Fix Type Error
//         const response = new Response(stream as unknown as ReadableStream<any>, {
//             headers: {
//               'Content-Type': downloadResponse.contentType || 'application/octet-stream',
//               'Content-Disposition': `inline; filename="${filepath}"`,
//             },
//           });

//         response.headers.set("Content-Type", downloadResponse.contentType || "application/octet-stream");
//         response.headers.set("Content-Disposition", `inline; filename="${filepath}"`);
    
//         return response;
//     } catch (err) { 
//         console.error("Error occurred during GET File route:", err);
//         const [{ error }, { status }] = handleAPIError(err);
//         return NextResponse.json({ error }, { status });
//     }
// }