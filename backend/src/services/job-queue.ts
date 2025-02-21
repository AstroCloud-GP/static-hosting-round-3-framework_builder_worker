import { Queue } from "bullmq";
import { BUILD_JOB_QUEUE_NAME, BuildJob } from "../../../shared-code/queues";
import { redisConfig } from "../config";

const jobQueue = new Queue<BuildJob>(BUILD_JOB_QUEUE_NAME, { connection: redisConfig })

export default async function addBuildJob(job: BuildJob) {
    const response = await jobQueue.add(`build-${job.project_id}-${job.build_number}`, job)

    console.log("Job added to jobQueue with id: ", response.id)
}
