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
            throw new FileNotFoundError(filepath)
        }

        return downloadResponse;

    } catch (err: any) {
        if (err.statusCode == 404)
            throw new FileNotFoundError(filepath);
        else
            throw err;
    }
}

async function uploadFile(filepath: string, file: File): Promise<BlobUploadCommonResponse> {
    // TODO: Redesign the error handling for these functions
    try {
        const containerClient = WikiContainerServiceClient;
        const blobClient = containerClient.getBlockBlobClient(filepath);
        const exists = await blobClient.exists();
        if (exists) 
            throw new FileAlreadyExistsError(filepath);

        const buffer = await file.arrayBuffer();
        const respone = await blobClient.uploadData(buffer);

        return respone;
    } catch (err: any) {
        if (err.statusCode == 409)
            throw new FileAlreadyExistsError(filepath)
        else
            throw err;
    }
}

function getFilesFromFormData(formData: FormData): File[] {
    const entries = Array.from(formData.entries());
    let files = [];

    for (const [key, value] of entries) {

        if (!(value instanceof File))
            throw new InvalidFileUploadError(`Invalid file upload: ${key}`);

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

// Error classes for Blob Storage

class BlobStorageError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'BlobStorageError';
    }
}

class FileNotFoundError extends BlobStorageError {
    constructor(filepath: string) {
        super(`File not found: ${filepath}`, 404);
    }
}

class FileAlreadyExistsError extends BlobStorageError {
    constructor(filepath: string) {
        super(`File already exists: ${filepath}`, 409);
    }
}

class InvalidFileUploadError extends BlobStorageError {
    constructor(message: string) {
        super(message, 400);
    }
}

export {
    BlobStorageError,
    FileNotFoundError,
    FileAlreadyExistsError,
    InvalidFileUploadError
};
