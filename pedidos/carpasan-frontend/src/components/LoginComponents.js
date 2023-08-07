// Ejemplo para LoginComponent.js
import React, { useState } from 'react';
import axios from 'axios';

function LoginComponent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      console.log(response.data);
      // Handle login success - store token, navigate to dashboard, etc.
    } catch (error) {
      console.error('Login failed', error);
      // Handle error - show an error message to the user, etc.
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginComponent;
