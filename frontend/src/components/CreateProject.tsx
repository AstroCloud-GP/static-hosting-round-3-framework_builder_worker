import React, { useState } from 'react';
import { ProjectCreateDTO } from '../../../shared-code/project'

interface Config {
  branch: string;
  buildCommand?: string;
  outputDir?: string;
  rootDir?: string;
  environment?: Record<string, string>;
}

interface CreateProjectProps {
  userId: number;
}

function CreateProject({ userId }: CreateProjectProps) {
  const [name, setName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [repositoryUrl, setRepositoryUrl] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [buildCommand, setBuildCommand] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');
  const [rootDir, setRootDir] = useState<string>('');
  const [environment, setEnvironment] = useState<string>('');

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();

    const config: Config = { branch };
    if (buildCommand) config.buildCommand = buildCommand;
    if (outputDir) config.outputDir = outputDir;
    if (rootDir) config.rootDir = rootDir;
    if (environment) config.environment = JSON.parse(environment);

    try {
      const response = await fetch('http://localhost:3000/project/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          token,
          repository_url: repositoryUrl,
          config,
          ownerId: userId
        } as ProjectCreateDTO)
      });
      if (!response.ok) {
        if (response.status === 404) {
          alert('Project creation failed');
        } else {
          alert('An error occurred');
        }
        return;
      }
      const result = await response.json();
      alert(`${result.message} Project ID: ${result.projectId}`);
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <section>
      <h2>Create Project</h2>
      <form onSubmit={createProject}>
        <label htmlFor="projectName">Project Name:</label>
        <input type="text" id="projectName" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <label htmlFor="projectToken">GitHub Token:</label>
        <input type="text" id="projectToken" value={token} onChange={(e) => setToken(e.target.value)} required />
        <br />
        <label htmlFor="repositoryUrl">Repository URL:</label>
        <input type="url" id="repositoryUrl" value={repositoryUrl} onChange={(e) => setRepositoryUrl(e.target.value)} required />
        <br />
        <label htmlFor="branch">Branch:</label>
        <input type="text" id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} required />
        <br />
        <label htmlFor="buildCommand">Build Command:</label>
        <input type="text" id="buildCommand" value={buildCommand} onChange={(e) => setBuildCommand(e.target.value)} />
        <br />
        <label htmlFor="outputDir">Output Directory:</label>
        <input type="text" id="outputDir" value={outputDir} onChange={(e) => setOutputDir(e.target.value)} />
        <br />
        <label htmlFor="rootDir">Root Directory:</label>
        <input type="text" id="rootDir" value={rootDir} onChange={(e) => setRootDir(e.target.value)} />
        <br />
        <label htmlFor="environment">Environment Variables (JSON):</label>
        <textarea id="environment" value={environment} onChange={(e) => setEnvironment(e.target.value)}></textarea>
        <br />
        <button type="submit">Create Project</button>
      </form>
    </section>
  );
}

export default CreateProject;
