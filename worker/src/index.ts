import { execSync } from "child_process";
import { buildJobWorker, initJobWorker } from "./queues";

/**
 * Main function that initializes the worker service
 */
async function main() {
  // Start the build job worker
  initJobWorker();

  // Check if Docker is reachable
  try {
    execSync(`docker ps`)
  } catch {
    console.error("Failed to connect to Docker. Shutting down.");
    process.exit(1);
  }

  console.log("Worker is running...");
}

main();