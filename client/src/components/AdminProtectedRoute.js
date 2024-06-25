import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

import { AuthContext } from '../AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthorized, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRights = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS +"/api/user_rights/${userId}");
        const userRights = response.data.map((ur) => ur.id_right);; 
        console.log("userRights", userRights)
        if (userRights && userRights.includes(1)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/'); 
        }
      } catch (error) {
        console.error('Error fetching user rights:', error);
        navigate('/login');
      }
    };

    if (isAuthorized) {
      fetchUserRights();
    } else {
      navigate('/login'); 
    }
  }, [isAuthorized, navigate]);

  return isAdmin ? children : null;
};

export default AdminProtectedRoute;
