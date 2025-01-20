import React from 'react';

interface LoginViewProps {
  handleLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ handleLogin }) => {
  return (
    <div>
      <h1>Login Required</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginView;
