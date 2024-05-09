import { BlobSASPermissions, BlobServiceClient, ContainerClient, StorageSharedKeyCredential, generateBlobSASQueryParameters } from "@azure/storage-blob";
import configProxy from "@/config";

const account = configProxy.blob_storage.account_name;
const accountKey = configProxy.blob_storage.account_key;
const container = configProxy.blob_storage.container_name;

if (!account || !accountKey || !container) {
    throw new Error("Blob Storage configuration missing");
}

const accountKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const WikiContainerServiceClient = new ContainerClient(`https://${account}.blob.core.windows.net/${container}`, accountKeyCredential);
// const WikiBlobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, accountKeyCredential);

export {
    WikiContainerServiceClient
}
