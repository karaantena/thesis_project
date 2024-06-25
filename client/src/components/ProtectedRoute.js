import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthorized } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/login');
    }
  }, [isAuthorized, navigate]);

  return isAuthorized ? children : null;
};

export default ProtectedRoute;
