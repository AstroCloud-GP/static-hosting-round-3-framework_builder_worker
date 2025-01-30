import React, { useState } from 'react';

interface SignInProps {
  onSignIn: (userId: number | string) => void;
}

function SignIn({ onSignIn }: SignInProps) {
  const [userId, setUserId] = useState<number | string>('');

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSignIn(userId);
    } catch {
      alert('An error occurred');
    }
  };

  return (
    <section>
      <h2>Sign In</h2>
      <form onSubmit={signIn}>
        <label htmlFor="userId">User ID:</label>
        <input type="number" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        <br />
        <button type="submit">Sign In</button>
      </form>
    </section>
  );
}

export default SignIn;
