import React, { useState } from 'react';

function CreateUser() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });
      if (!response.ok) {
        if (response.status === 404) {
          alert('User creation failed');
        } else {
          alert('An error occurred');
        }
        return;
      }
      const result = await response.json();
      alert(`User created with ID: ${result.id}`);
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <section>
      <h2>Create User</h2>
      <form onSubmit={createUser}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <button type="submit">Create User</button>
      </form>
    </section>
  );
}

export default CreateUser;
