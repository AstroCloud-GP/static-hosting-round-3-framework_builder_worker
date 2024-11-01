import { Queue, Worker } from "bullmq";
import { BUILD_RESULT_QUEUE_NAME, BUILD_JOB_QUEUE_NAME, BuildResult, BuildJob } from "../../shared-code/queues";
import { redisConfig } from "./config";

const buildResultQueue = new Queue<BuildResult>(BUILD_RESULT_QUEUE_NAME, { connection: redisConfig })

export const buildJobWorker = new Worker<BuildJob>(BUILD_JOB_QUEUE_NAME, async (job) => {
    console.log(`Building project ${job.data.project_id} with build number ${job.data.build_number}`);


    // Simulate a build time
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Finished building project ${job.data.project_id} with build number ${job.data.build_number}`);

    await buildResultQueue.add(`event-${job.data.project_id}-${job.data.build_number}`, {
        project_id: job.data.project_id,
        build_number: job.data.build_number,
        status: "SUCCESS",
        logs: "Build completed successfully",
    })

}, { connection: redisConfig })