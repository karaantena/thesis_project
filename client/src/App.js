import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import NavigationBar from './components/NavigationBar';
import PatientsList from './components/PatientsList';
import Login from './components/Login';
import Register from './components/Register';
import PatientDetails from './components/PatientDetails';
import CommonForm from './components/CommonForm';
import UserRights from './components/UserRights'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import LogoutButton from './components/LogoutButton';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3c788a',
    },
    secondary: {
      main: '#c4daf4',
    },
    background: {
      default: '#a8a7a7',
    },
  },
});

const AppContent = () => {
  const { isAuthorized } = useContext(AuthContext);

  return (
    <>
      {isAuthorized && <NavigationBar />}
      {isAuthorized && (
        <div className="app-container">
          <div className="content-wrapper">
            <div className="content-container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <PatientsList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chestXray"
                  element={
                    <ProtectedRoute>
                      <CommonForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-rights"
                  element={
                    <AdminProtectedRoute>
                      <UserRights />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/patients/:id"
                  element={
                    <ProtectedRoute>
                      <PatientDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <PatientsList />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      )}
      {!isAuthorized && (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
