import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);

  return (
    <div>
      <form onSubmit={login}>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
