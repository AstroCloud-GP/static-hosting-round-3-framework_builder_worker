
export interface ProjectConfig {
    branch?: string | null,
    buildCommand?: string | null,
    rootDir?: string | null,
    outputDir?: string | null,
    environment?: {
        [key: string]: string
    } | null
}

export interface ProjectCreateDTO {
    name: string,
    token: string,
    repository_url: string,
    config: ProjectConfig
}