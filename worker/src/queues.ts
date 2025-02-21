import { Queue, Worker } from "bullmq";
import { BUILD_RESULT_QUEUE_NAME, BUILD_JOB_QUEUE_NAME, BuildResult, BuildJob } from "../../shared-code/queues";
import { redisConfig } from "./config";
import { buildJobProcessor } from "./build-job-process";

/** Queue for storing build results after job completion */
export const buildResultQueue = new Queue<BuildResult>(BUILD_RESULT_QUEUE_NAME, { connection: redisConfig })

/** Worker that processes build jobs from the build job queue */
export const buildJobWorker = new Worker<BuildJob>(BUILD_JOB_QUEUE_NAME, buildJobProcessor, {
    connection: redisConfig,
    removeOnFail: {
        count: 0
    },
    maxStalledCount: 0
})

/**
 * Initializes the build job worker with error handling
 */
export function initJobWorker() {
    buildJobWorker.on("completed", (job) => {
        console.log(`Build job ${job.id} completed successfully`);
    });

    buildJobWorker.on("failed", (job, err) => {
        console.error(`Build job ${job?.id} failed with error: ${err.message}`);
    });
}