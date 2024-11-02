import { config } from "dotenv";
process.env.DOCKER? config({path: '/run/secrets/secrets_file'}) : config();

export const redisConfig = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
}

export const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME || "atwaa";