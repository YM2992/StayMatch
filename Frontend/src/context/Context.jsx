import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api";

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

  const loadPreferences = async (user) => {
    const response = await api.httpPost(api.paths.getPreferences, {user});
    if (response.error) {
      return new Error("Failed to load preferences:" + response.error);
    }
    if (!response.preferences) {
      return new Error("No preferences found for the user.");
    }
    updatePreferences(response.preferences, true);
  }

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

    setPreferences([]); // Reset preferences when updating auth details

    try {
      loadPreferences(user);
    } catch (error) {
      console.error("Error loading preferences:", error);
    }

    return user;
  };

  const clearAuthDetails = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("preferences");
    setAuthDetails(null);
    setPreferences(null);
  };

  // Function to set user preferences
  const updatePreferences = (preferences, skipDbSave) => {
    if (!preferences) {
      console.error("Invalid preferences provided");
      return;
    }

    const existingPreferences = JSON.parse(localStorage.getItem("preferences")) || [];

    if (!skipDbSave) {
      const addedPreferences = preferences.filter(
        (pref) => !existingPreferences.includes(pref)
      );
      const removedPreferences = existingPreferences.filter(
        (pref) => !preferences.includes(pref)
      );
  
      addedPreferences.forEach((hotelId) => {
        api.httpPost(api.paths.addPreference, { user: authDetails, hotelId });
      });
  
      removedPreferences.forEach((hotelId) => {
        api.httpPost(api.paths.removePreference, { user: authDetails, hotelId });
      });
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

export const useAppContext = () => {
  return useContext(AppContext);
};
  