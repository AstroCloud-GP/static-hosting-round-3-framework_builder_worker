import React, { useState } from 'react';

interface Build {
  build_number: number;
  build_status: string;
  logs: string;
  project_id: number;
}

function ProjectBuilds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [projectId, setProjectId] = useState<number | string>('');
  const [visibleLogs, setVisibleLogs] = useState<{ [key: number]: boolean }>({});

  const getProjectBuilds = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}/builds`);
      if (!response.ok) {
        if (response.status === 404) {
          alert('Builds not found');
        } else {
          alert('An error occurred');
        }
        return;
      }
      const builds = await response.json();
      setBuilds(builds);
    } catch {
      alert('An error occurred');
    }
  };

  const toggleLogs = (buildNumber: number) => {
    setVisibleLogs((prev) => ({
      ...prev,
      [buildNumber]: !prev[buildNumber],
    }));
  };

  const rebuildProject = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/project/${projectId}/build`, {
        method: 'POST'
      });
      if (!response.ok) {
        if (response.status === 404) {
          alert('Rebuild failed');
        } else {
          alert('An error occurred');
        }
        return;
      }
      const result = await response.json();
      alert(result.message);
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <section>
      <h2>Project Builds</h2>
      <form onSubmit={getProjectBuilds}>
        <label htmlFor="projectId">Project ID:</label>
        <input type="number" id="projectId" value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
        <br />
        <button type="submit">Get Builds</button>
      </form>
      <div className="projectBuilds">
        {builds.map((build) => (
          <div key={build.build_number} className="build">
            <h4>Build #{build.build_number}</h4>
            <p><strong>Status:</strong> {build.build_status}</p>
            <p><strong>Logs:</strong> <button onClick={() => toggleLogs(build.build_number)}>Show Logs</button></p>
            {visibleLogs[build.build_number] && (
              <pre className="logs">{build.logs}</pre>
            )}
            <button onClick={() => rebuildProject(build.project_id)}>Rebuild</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectBuilds;
