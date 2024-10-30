import { buildJobWorker } from "./job-queue";

async function main() {
  buildJobWorker.on("completed", (job) => {
    console.log(`Build job ${job.id} completed successfully`);
  });

  buildJobWorker.on("failed", (job, err) => {
    console.error(`Build job ${job?.id} failed with error: ${err.message}`);
  });

  console.log("Worker is running...");
}

main();