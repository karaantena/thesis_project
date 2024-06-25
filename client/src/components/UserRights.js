import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import {
  Typography,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Register from './Register';

const useStyles = makeStyles((theme) => ({
  userContainer: {
    display: 'flex',
    height: '100vh',
  },
  usersPanel: {
    flex: '0 0 60%',
    padding: theme.spacing(2),
    borderRight: '1px solid #ddd',
    overflowY: 'auto',
  },
  rightsPanel: {
    flex: '0 0 35%',
    overflowY: 'auto',
    marginLeft: '20px',
  },
  table: {
    minWidth: 650,
  },
  tableRights: {
    minWidth: 300,
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  tableHeader: {
    backgroundColor: '#c4daf4',
    color: 'black',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    fontWeight: 'bold',
  },
  checkBoxCell: {
    width: '10%',
  },
  rightsCell: {
    width: '50%',
  },
  oddRow: {
    backgroundColor: '#f9f9f9',
  },
}));

const UserRights = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [rights, setRights] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRights, setUserRights] = useState([]);
  const [openDialogRights, setOpenDialogRights] = useState(false);
  const [openDialogRegister, setOpenDialogRegister] = useState(false);
  const [newRightDescription, setNewRightDescription] = useState('');
  const [newRightIsDepartment, setNewRightIsDepartment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/users");
        const rightsResponse = await axios.get(process.env.REACT_APP_API_ADDRESS + "/api/rights");
        setUsers(usersResponse.data);
        setRights(rightsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchUserRights = async () => {
        try {
          const userRightsResponse = await axios.get(process.env.REACT_APP_API_ADDRESS+"/api/user_rights/" + selectedUser.id);
          setUserRights(userRightsResponse.data.map((ur) => ur.id_right));
        } catch (error) {
          console.error('Error fetching user rights:', error);
        }
      };

      fetchUserRights();
    }
  }, [selectedUser]);

  const handleRightChange = async (rightId, checked) => {
    try {
      console.log('Updating right:', rightId, 'for user:', selectedUser.id, 'to:', checked);
      const response = await axios.post(process.env.REACT_APP_API_ADDRESS + "/api/user_rights", {
        id_user: selectedUser.id,
        id_right: rightId,
        checked,
      });
      console.log('Update response:', response.data);
      setUserRights((prevRights) =>
        checked ? [...prevRights, rightId] : prevRights.filter((id) => id !== rightId)
      );
    } catch (error) {
      console.error('Error updating user rights:', error);
    }
  };

  const handleUserSelection = (user, checked) => {
    if (checked) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
      setUserRights([]);
    }
  };

  const handleDialogOpen = () => {
    setOpenDialogRights(true);
  };

  const handleDialogClose = () => {
    setOpenDialogRights(false);
    setOpenDialogRegister(false);
  };


  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      const response = await axios.delete(process.env.REACT_APP_API_ADDRESS + "/api/users/" +userId);
      console.log('Delete user response:', response.data);
      window.location.reload(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddRight = () => {
    setNewRightDescription('');
    setNewRightIsDepartment(false);
    setOpenDialogRights(true);
  };

  const handleRightSave = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_ADDRESS + "/api/rights", {
        description: newRightDescription,
        is_department: newRightIsDepartment ? 1 : 0,
      });
      console.log('New right added:', response.data);
      alert('New right added.');
      window.location.reload(false);
      setOpenDialogRights(false);
    } catch (error) {
      console.error('Error adding new right:', error);
    }
  };

  const handleRegisterOpen = () => {
    setOpenDialogRegister(true);
  };

  const handleRegisterClose = () => {
    setOpenDialogRegister(false);
  };

  return (
    <div className={classes.userContainer}>
      <div className={classes.usersPanel}>
        <Button variant="contained" color="primary" onClick={handleRegisterOpen}>
          Register
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddRight}
          style={{ marginLeft: '10px' }}
        >
          Add Right
        </Button>
        <Paper className={classes.paper}>
          <Typography variant="h5">Users</Typography>
          <TableContainer>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>First Name</TableCell>
                  <TableCell className={classes.tableHeader}>Last Name</TableCell>
                  <TableCell className={classes.tableHeader}>Email</TableCell>
                  <TableCell className={classes.tableHeader}>Select</TableCell>
                  <TableCell className={classes.tableHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} className={index % 2 === 0 ? '' : classes.oddRow}>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={selectedUser?.id === user.id}
                        onChange={(e) => handleUserSelection(user, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell className={classes.checkBoxCell}>
                      <IconButton aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <div className={classes.rightsPanel}>
        {selectedUser && (
          <Paper className={classes.paper}>
            <Typography variant="h5">Rights</Typography>
            <TableContainer>
              <Table className={classes.tableRights}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeader}>Right</TableCell>
                    <TableCell className={classes.tableHeader}>Assign</TableCell>
                    <TableCell className={classes.tableHeader}>Department</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rights.map((right, index) => (
                    <TableRow key={right.id} className={index % 2 === 0 ? '' : classes.oddRow}>
                      <TableCell className={classes.rightsCell}>{right.description}</TableCell>
                      <TableCell className={classes.rightsCell}>
                        <Checkbox
                          checked={userRights.includes(right.id)}
                          onChange={(e) => handleRightChange(right.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className={classes.rightsCell}>
                        <Checkbox checked={right.is_department === 1} disabled />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </div>
      <Dialog open={openDialogRights} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Right</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={newRightDescription}
            onChange={(e) => setNewRightDescription(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newRightIsDepartment}
                onChange={(e) => setNewRightIsDepartment(e.target.checked)}
              />
            }
            label="Is Department"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRightSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogRegister} onClose={handleRegisterClose} fullWidth maxWidth="sm">
        <DialogTitle>Register New User</DialogTitle>
        <DialogContent>
          <Register onClose={handleRegisterClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRights;
