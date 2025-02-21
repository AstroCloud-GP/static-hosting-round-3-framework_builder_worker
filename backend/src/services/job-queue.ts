import { Queue } from "bullmq";
import { BUILD_JOB_QUEUE_NAME, BuildJob } from "../../../shared-code/queues";
import { redisConfig } from "../config";

const jobQueue = new Queue<BuildJob>(BUILD_JOB_QUEUE_NAME, { connection: redisConfig })

/**
 * Adds a new build job to the queue
 * @param job - The build job configuration to be added
 * @returns Promise that resolves when the job is added successfully
 */
export default async function addBuildJob(job: BuildJob) {
    const response = await jobQueue.add(`build-${job.project_id}-${job.build_number}`, job)

    console.log("Job added to jobQueue with id: ", response.id)
}
