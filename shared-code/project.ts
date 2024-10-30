
export interface ProjectConfig {
    branch: string,
    buildCommand: string,
    rootDir: string,
    outputDir: string,
    environment: {
        [key: string]: string
    }
}