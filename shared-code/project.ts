/**
 * Configuration options for a project.
 */
export interface ProjectConfig {
    branch?: string | null,
    buildCommand?: string | null,
    rootDir?: string | null,
    outputDir?: string | null,
    environment?: {
        [key: string]: string
    } | null
}

/**
 * Data required to create a new project.
 */
export interface ProjectCreateDTO {
    name: string,
    token: string,
    repository_url: string,
    config: ProjectConfig,
    ownerId: number
}