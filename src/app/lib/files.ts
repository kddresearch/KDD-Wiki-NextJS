import { BlobDownloadResponseParsed, BlobSASPermissions, BlobServiceClient, BlobUploadCommonResponse, ContainerClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from "@azure/storage-blob";
import configProxy from "@/config";

const account = configProxy.blob_storage.account_name;
const accountKey = configProxy.blob_storage.account_key;
const container = configProxy.blob_storage.container_name;

if (!account || !accountKey || !container) {
    throw new Error("Blob Storage configuration missing");
}

const accountKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const WikiContainerServiceClient = new ContainerClient(`https://${account}.blob.core.windows.net/${container}`, accountKeyCredential);

// console.log(WikiContainerServiceClient);

async function getFile(filepath: string): Promise<BlobDownloadResponseParsed> {

    console.log(`Fetching file: ${filepath}`);

    try {

        const containerClient = WikiContainerServiceClient;
        const blobClient = containerClient.getBlobClient(filepath);
    
        const downloadResponse = await blobClient.download();
        const stream = downloadResponse.readableStreamBody;

        if (!stream) {
            console.error(`Downloaded file: ${filepath} does not exist!`);
            throw {status: 404, message: "File not found" }
        }

        return downloadResponse;

    } catch (err: any) {

        console.error(`Error fetching file ${filepath}: ${err.message}`);

        if (err.statusCode == 404)
            throw { status: 404, message: "File not found" }

        throw { status: err.statusCode, message: `Error fetching file ${filepath}`}
    }
}

async function uploadFile(filepath: string, file: File): Promise<BlobUploadCommonResponse> {
    // TODO: Redesign the error handling for these functions
    try {


        const containerClient = WikiContainerServiceClient;
        const blobClient = containerClient.getBlockBlobClient(filepath);
        const exists = await blobClient.exists();
        if (exists) 
            throw { statusCode: 409, message: "File already exists" }

        const buffer = await file.arrayBuffer();
        const respone = await blobClient.uploadData(buffer);

        return respone;
    } catch (err: any) {
        console.error(`Error uploading file ${filepath}: ${err.message}`);

        if (err.statusCode == 409)
            throw { status: 409, message: "File already exists" }

        throw { status: err.statusCode, message: `Error uploading file ${filepath}`}
    }
}

function getFilesFromFormData(formData: FormData): File[] {
    const entries = Array.from(formData.entries());
    let files = [];

    for (const [key, value] of entries) {

        if (!(value instanceof File)) {
            throw { status: 400, message: `Invalid file uploaded: ${key}`}
        }

        files.push(value as File);
    }

    return files;
}

export {
    getFile,
    uploadFile,

    // Utility functions
    getFilesFromFormData
}