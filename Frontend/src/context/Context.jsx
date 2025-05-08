import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AppContext
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [authDetails, setAuthDetails] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage on initial load
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAuthDetails(user);
    }
  }, []);

  // Function to retrieve authentication details
  const getAuthDetails = () => authDetails;

  // Function to set authentication details
  const updateAuthDetails = (user) => {
    if (!user) {
      console.error('Invalid authentication details provided');
      return;
    }

    if (!user.userId || !user.token) {
      console.error('User ID and token are required for authentication details');
      return;
    }

    localStorage.setItem('user', JSON.stringify(user));
    setAuthDetails(user);
    return user;
  };

  return (
    <AppContext.Provider value={{ authDetails, getAuthDetails, updateAuthDetails }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};