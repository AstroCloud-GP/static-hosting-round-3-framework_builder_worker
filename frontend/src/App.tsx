import React, { useState } from 'react';
import CreateUser from '../../frontend/src/components/CreateUser';
import SignIn from '../../frontend/src/components/SignIn';
import UserProjects, { Project } from '../../frontend/src/components/UserProjects';
import ProjectBuilds from '../../frontend/src/components/ProjectBuilds';
import CreateProject from '../../frontend/src/components/CreateProject';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<number | string>('');

  const handleSignIn = async (userId: number | string) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          alert('User not found');
        } else {
          alert('An error occurred');
        }
        return;
      }
      const user = await response.json();
      setProjects(user.projects);
      setUserId(userId);
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <CreateUser />
      <SignIn onSignIn={handleSignIn} />
      <UserProjects projects={projects} />
      <ProjectBuilds />
      <CreateProject userId={+userId} />
    </div>
  );
}

export default App;
