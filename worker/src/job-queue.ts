import { Worker } from "bullmq";
import { BUILD_JOB_QUEUE_NAME, BuildJob } from "../../shared-code/job-queue";


export const buildJobWorker = new Worker<BuildJob>(BUILD_JOB_QUEUE_NAME, async (job) => {
    console.log(`Building project ${job.data.project_id} with build number ${job.data.build_number}`);
}, {
    connection: {
        host: "localhost",
        port: 6379
    }
})