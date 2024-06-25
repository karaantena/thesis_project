import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import './UsersData.css';

Modal.setAppElement('#root');

const useStyles = makeStyles((theme) => ({
  changePasswordButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  closeModalButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  error: {
    color: 'red',
    marginTop: theme.spacing(1),
  },
}));

const UsersData = ({ onUserIconClick }) => {
  const classes = useStyles();
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_ADDRESS+ "/api/user/" + userId);
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          setError(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('An error occurred. Please try again.');
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleIconClick = () => {
    setIsModalOpen(true);
    if (onUserIconClick) {
      onUserIconClick();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(process.env.REACT_APP_API_ADDRESS + "/api/change-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Password changed successfully');
        setIsModalOpen(false);
        setError('');
      } else {
        setError(data.message || 'Password change failed');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <div className="user-icon" onClick={handleIconClick}>
        <FaUserCircle size={30} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{user?.first_name} {user?.last_name}</h2>
        <h4>Change Password</h4>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={classes.error}>{error}</p>}
          <div className="buttons">
            <Button type="submit" variant="contained" color="primary" className={classes.changePasswordButton}>
              Change Password
            </Button>
            <Button type="button" onClick={handleCloseModal} variant="contained" color="secondary" className={classes.closeModalButton}>
              Close
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersData;
