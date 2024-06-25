import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    try {
      const savedAuthState = localStorage.getItem('isAuthorized');
      return savedAuthState ? JSON.parse(savedAuthState) : false;
    } catch (error) {
      console.error('Error retrieving isAuthorized from localStorage:', error);
      return false;
    }
  });

  const [userId, setUserId] = useState(() => {
    try {
      const savedUserId = localStorage.getItem('userId');
      return savedUserId ? JSON.parse(savedUserId) : null;
    } catch (error) {
      console.error('Error retrieving userId from localStorage:', error);
      return null; 
    }
  });

  useEffect(() => {
    try {
      const savedAuthState = localStorage.getItem('isAuthorized');
      if (savedAuthState !== JSON.stringify(isAuthorized)) {
        localStorage.setItem('isAuthorized', JSON.stringify(isAuthorized));
      }
    } catch (error) {
      console.error('Error saving isAuthorized to localStorage:', error);
    }
  }, [isAuthorized]);

  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId !== JSON.stringify(userId)) {
        localStorage.setItem('userId', JSON.stringify(userId));
      }
    } catch (error) {
      console.error('Error saving userId to localStorage:', error);
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
