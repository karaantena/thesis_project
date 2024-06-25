import React, { useContext } from "react";
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const LogoutButton = () => {
  const { setIsAuthorized } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthorized(false);
    navigate('/login'); 
  };

  return (
    <IconButton color="inherit" onClick={handleLogout}>
      <ExitToAppIcon />
    </IconButton>
  );
};

export default LogoutButton;
