import { Queue, Worker } from "bullmq";
import { BUILD_RESULT_QUEUE_NAME, BUILD_JOB_QUEUE_NAME, BuildResult, BuildJob } from "../../shared-code/queues";
import { redisConfig } from "./config";
import { buildJobProcessor } from "./build-job-process";

export const buildResultQueue = new Queue<BuildResult>(BUILD_RESULT_QUEUE_NAME, { connection: redisConfig })

export const buildJobWorker = new Worker<BuildJob>(BUILD_JOB_QUEUE_NAME, buildJobProcessor, {
    connection: redisConfig,
    removeOnFail: {
        count: 0
    },
    maxStalledCount: 0
})