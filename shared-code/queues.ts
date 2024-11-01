import exp from "constants";
import { ProjectConfig } from "./project";

export interface BuildJob {
    project_id: number,
    build_number: number,
    project_config: ProjectConfig,
    github_token: string,
    github_url: string,
    container_name: string
}

export const BUILD_JOB_QUEUE_NAME = "jobs"

export interface BuildResult {
    project_id: number,
    build_number: number,
    status: "SUCCESS" | "FAIL",
    logs: string,
}

export const BUILD_RESULT_QUEUE_NAME = "events"