import { BlobDownloadResponseParsed, BlobSASPermissions, BlobServiceClient, ContainerClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from "@azure/storage-blob";
import configProxy from "@/config";

const account = configProxy.blob_storage.account_name;
const accountKey = configProxy.blob_storage.account_key;
const container = configProxy.blob_storage.container_name;

if (!account || !accountKey || !container) {
    throw new Error("Blob Storage configuration missing");
}

const accountKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const WikiContainerServiceClient = new ContainerClient(`https://${account}.blob.core.windows.net/${container}`, accountKeyCredential);

console.log(WikiContainerServiceClient);

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

export {
    getFile
}