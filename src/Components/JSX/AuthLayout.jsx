import React from 'react';
import { Outlet } from 'react-router-dom';
import '../CSS/Auth.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout; 