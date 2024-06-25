import React, { useState, useEffect, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  useMediaQuery
} from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import UsersData from './UsersData';
import LogoutButton from './LogoutButton';
import axios from 'axios'; 
import { AuthContext } from '../AuthContext';


const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 0,
    bottom: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
    boxShadow: 'none', 
    backgroundColor: '#fff', 
  },
  menuButton: {
    textAlign: 'center',
    color: '#000',
    textDecoration: 'none',
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    fontSize: '16px',
    width: '150px',
    borderBottom: '3px solid transparent',
    '&:hover': {
      borderBottom: '3px solid #3c788a',
      color: '#3c788a',
    },
  },
  selectedButton: {
    borderBottom: '3px solid #3c788a',
    color: '#3c788a',
  },
  userLogoutWrapper: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    color: '#0f2a39',
  },
  drawer: {
    width: 250,
  },
  drawerItem: {
    width: '100%',
    fontSize: '16px',
    color: '#000',
  },
}));

const NavigationBar = () => {
  const classes = useStyles();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(location.pathname);
  const [isAdmin, setIsAdmin] = useState(false); 
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { userId } = useContext(AuthContext);


  useEffect(() => {
    fetchUserRights();
  }, []);

  const fetchUserRights = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/user_rights/" + userId);
      const userRights = response.data.map((ur) => ur.id_right);
      setIsAdmin(userRights.includes(1));
    } catch (error) {
      console.error('Error fetching user rights:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (path) => {
    console.log(`Selected path: ${path}`);
    setSelectedButton(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleUserIconClick = () => {
    setDrawerOpen(false);
  };

  const drawerContent = (
    <List className={classes.drawer}>
      <ListItem
        button
        component={Link}
        to="/patients"
        className={selectedButton === '/patients' ? classes.selectedButton : ''}
        onClick={() => handleMenuItemClick('/patients')}
      >
        <ListItemText primary="Patients Data" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/chestXray"
        className={selectedButton === '/chestXray' ? classes.selectedButton : ''}
        onClick={() => handleMenuItemClick('/chestXray')}
      >
        <ListItemText primary="Chest X-Ray" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/user-rights"
        disabled={!isAdmin} 
        className={selectedButton === '/user-rights' ? classes.selectedButton : ''}
        onClick={() => handleMenuItemClick('/user-rights')}
      >
        <ListItemText primary="Users" />
      </ListItem>
      <div className={classes.userLogoutWrapper}>
        <UsersData onUserIconClick={handleUserIconClick} />
        <LogoutButton />
      </div>
    </List>
  );

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {isMobile ? (
            <IconButton edge="start" color="black" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Button
                component={Link}
                to="/patients"
                className={`${classes.menuButton} ${
                  selectedButton === '/patients' ? classes.selectedButton : ''
                }`}
                onClick={() => handleMenuItemClick('/patients')}
              >
                Patients Data
              </Button>
              <Button
                component={Link}
                to="/chestXray"
                className={`${classes.menuButton} ${
                  selectedButton === '/chestXray' ? classes.selectedButton : ''
                }`}
                onClick={() => handleMenuItemClick('/chestXray')}
              >
                Chest X-Ray
              </Button>
              <Button
                component={Link}
                to="/user-rights"
                disabled={!isAdmin}
                className={`${classes.menuButton} ${
                  selectedButton === '/user-rights' ? classes.selectedButton : ''
                }`}
                onClick={() => handleMenuItemClick('/user-rights')}
              >
                Users
              </Button>
            </>
          )}
          <div className={classes.userLogoutWrapper}>
            <UsersData onUserIconClick={handleUserIconClick} />
            <LogoutButton />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default NavigationBar;
