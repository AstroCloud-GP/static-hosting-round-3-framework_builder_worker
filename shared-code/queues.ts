import exp from "constants";
import { ProjectConfig } from "./project";

/**
 * Represents a build job with necessary details for processing.
 */
export interface BuildJob {
    project_id: number,
    build_number: number,
    project_config: ProjectConfig,
    github_token: string,
    github_url: string,
    container_name: string
}

/**
 * The name of the queue used for build jobs.
 */
export const BUILD_JOB_QUEUE_NAME = "jobs"

/**
 * Represents the result of a build process.
 */
export interface BuildResult {
    project_id: number;
    build_number: number;
    status: "SUCCESS" | "FAIL";
    logs: string;
}

export const BUILD_RESULT_QUEUE_NAME = "events"