import React, { createContext, useState, useContext, useEffect } from "react";

// Create the AppContext
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [authDetails, setAuthDetails] = useState(null);
  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    // Retrieve user data from localStorage on initial load
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setAuthDetails(user);
    }

    // Retrieve preferences from localStorage on initial load
    const userPreferences = JSON.parse(localStorage.getItem("preferences"));
    if (userPreferences) {
      setPreferences(userPreferences);
    }
  }, []);

  const getAuthDetails = () => authDetails;
  const updateAuthDetails = (user) => {
    if (!user) {
      console.error("Invalid authentication details provided");
      return;
    }

    if (!user.userId || !user.token) {
      console.error(
        "User ID and token are required for authentication details"
      );
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setAuthDetails(user);
    return user;
  };
  const clearAuthDetails = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("preferences");
    setAuthDetails(null);
    setPreferences(null);
  };

  // Function to set user preferences
  const updatePreferences = (preferences) => {
    if (!preferences) {
      console.error("Invalid preferences provided");
      return;
    }

    localStorage.setItem("preferences", JSON.stringify(preferences));
    setPreferences(preferences);
  };

  return (
    <AppContext.Provider
      value={{
        authDetails,
        getAuthDetails,
        updateAuthDetails,
        clearAuthDetails,
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
