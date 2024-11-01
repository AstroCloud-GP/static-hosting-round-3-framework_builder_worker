import { Queue } from "bullmq";
import { BUILD_JOB_QUEUE_NAME, BuildJob } from "../../shared-code/queues";

const jobQueue = new Queue<BuildJob>(BUILD_JOB_QUEUE_NAME, {
    connection: {
        host: "localhost",
        port: 6379
    }
})

export default async function addBuildJob(job: BuildJob) {
    const response = await jobQueue.add(`build-${job.project_id}-${job.build_number}`, {
        project_id: job.project_id,
        build_number: job.build_number,
        project_config: job.project_config,
        github_token: job.github_token,
        github_url: job.github_url,
        container_name: job.container_name
    })

    console.log("Job added to jobQueue with id: ", response.id)
}
