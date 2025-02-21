import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { AZURE_STORAGE_ACCOUNT_NAME } from "./config";
import mime from "mime-types";

const blobService = new BlobServiceClient(`https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, new DefaultAzureCredential())

/**
 * Creates a new blob container
 * @param containerName Name of the container to create
 */
async function createContainer(containerName: string) {
    const containerClient = blobService.getContainerClient(containerName)
    
    const createContainerResponse = await containerClient.create({
        access: "container"
    })

    console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId)
}

/**
 * Checks if a container exists
 * @param containerName Name of the container to check
 * @returns Boolean indicating if the container exists
 */
async function doesContainerExist(containerName: string) {
    const containerClient = blobService.getContainerClient(containerName)
    
    return await containerClient.exists()
}

/**
 * Uploads a file to a blob container
 * @param containerName Target container name
 * @param blobName Name of the blob (file) to create
 * @param file File buffer to upload
 */
async function uploadToContainer(containerName: string, blobName: string, file: Buffer) {
    const containerClient = blobService.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const mimeType = mime.lookup(blobName) || "application/octet-stream"; // Default if MIME type is not found
    const uploadBlobResponse = await blockBlobClient.upload(file, file.length, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
        },
    })

    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId)
}

/**
 * Deletes all blobs in a container
 * @param containerName Name of the container to empty
 */
async function emptyContainer(containerName: string) {
    const containerClient = blobService.getContainerClient(containerName)

    for await (const blob of containerClient.listBlobsFlat()) {
        await containerClient.deleteBlob(blob.name)
    }

    console.log(`Emptied container ${containerName}`)
}

/** Azure service utility functions */
export const AzureService = {
    createContainer,
    doesContainerExist,
    uploadToContainer,
    emptyContainer
}

/**
 * Test function for Azure blob operations
 */
async function testAzure() {
    const containerName = "container1";
    console.log("Checking if container exists...")

  if(await AzureService.doesContainerExist(containerName)) {
    console.log("Container already exists")
    await AzureService.emptyContainer(containerName)
    console.log("Container emptied")
  } else {
    console.log("Creating container...")
    await AzureService.createContainer(containerName)
  }

  const randomFileName = `file-${Math.random().toString(36).substring(7)}.txt`
  AzureService.uploadToContainer(containerName, randomFileName, Buffer.from("Hello, Azure!"))
  console.log(`Uploaded ${randomFileName} to container1`)
}