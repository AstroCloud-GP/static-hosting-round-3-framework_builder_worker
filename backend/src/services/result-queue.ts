import { Worker } from "bullmq";
import { BUILD_RESULT_QUEUE_NAME, BuildResult } from "../../../shared-code/queues";
import { updateBuild } from "../models/Build";
import { redisConfig } from "../config";

const buildResultWorker = new Worker<BuildResult>(BUILD_RESULT_QUEUE_NAME, async (job) => {
    console.log(`Build result for project ${job.data.project_id} with build number ${job.data.build_number}: ${job.data.status}`);
    await updateBuild(job.data.project_id, job.data.build_number, job.data.status, job.data.logs);
}, { connection: redisConfig });

export function initResultWorker() {
    buildResultWorker.on("completed", (job) => {
        console.log(`Build result job ${job.id} completed successfully`);
    });

    buildResultWorker.on("failed", (job, err) => {
        console.error(`Build result job ${job?.id} failed with error: ${err.message}`);
    });
}