import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { AZURE_STORAGE_ACCOUNT_NAME } from "./config";

const blobService = new BlobServiceClient(`https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, new DefaultAzureCredential())

async function createContainer(containerName: string) {
    const containerClient = blobService.getContainerClient(containerName)
    
    const createContainerResponse = await containerClient.create({
        access: "container"
    })

    console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId)
}

async function doesContainerExist(containerName: string) {
    const containerClient = blobService.getContainerClient(containerName)
    
    return await containerClient.exists()
}

async function uploadToContainer(containerName: string, blobName: string, file: Buffer) {
    const containerClient = blobService.getContainerClient(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const uploadBlobResponse = await blockBlobClient.upload(file, file.length)

    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId)
}

async function emptyContainer(containerName: string) {
    const containerClient = blobService.getContainerClient(containerName)

    for await (const blob of containerClient.listBlobsFlat()) {
        await containerClient.deleteBlob(blob.name)
    }

    console.log(`Emptied container ${containerName}`)
}

export const AzureService = {
    createContainer,
    doesContainerExist,
    uploadToContainer,
    emptyContainer
}

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