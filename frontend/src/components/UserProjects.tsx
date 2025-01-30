import React from 'react';

export interface Project {
  id: number;
  name: string;
  repository_url: string;
  config_branch: string;
  config_build_command?: string;
  config_out_dir?: string;
  config_root_dir?: string;
  container_name: string;
}

interface UserProjectsProps {
  projects: Project[];
}

function UserProjects({ projects }: UserProjectsProps) {
  return (
    <section>
      <h2>User Projects</h2>
      <div className="userProjects">
        {projects.map((project) => (
          <div key={project.id} className="project">
            <h3>{project.name}</h3>
            <p><strong>Project ID:</strong> {project.id}</p>
            <p><strong>Repository URL:</strong> {project.repository_url}</p>
            <p><strong>Branch:</strong> {project.config_branch}</p>
            <p><strong>Build Command:</strong> {project.config_build_command || ''}</p>
            <p><strong>Output Directory:</strong> {project.config_out_dir || ''}</p>
            <p><strong>Root Directory:</strong> {project.config_root_dir || ''}</p>
            <p><strong>Deployment URL:</strong> <a href={`http://${project.container_name}.lvh.me`} target="_blank" rel="noopener noreferrer">{project.container_name}.lvh.me</a></p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UserProjects;
