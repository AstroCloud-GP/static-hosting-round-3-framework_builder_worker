import { ProjectConfig } from "./project";

export interface BuildJob {
    project_id: string,
    build_number: number,
    project_config: ProjectConfig,
    github_token: string,
    github_url: string
}

export const BUILD_JOB_QUEUE_NAME = "jobs"