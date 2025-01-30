import { execSync } from "child_process";
import { buildJobWorker } from "./queues";

async function main() {
  buildJobWorker.on("completed", (job) => {
    console.log(`Build job ${job.id} completed successfully`);
  });

  buildJobWorker.on("failed", (job, err) => {
    console.error(`Build job ${job?.id} failed with error: ${err.message}`);
  });

  // Check if Docker is running
  try {
    execSync(`docker ps`)
  } catch {
    console.error("Failed to connect to Docker. Shutting down.");
    process.exit(1);
  }

  console.log("Worker is running...");
}

main();