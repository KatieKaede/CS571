import React, { createContext, useContext, useState } from 'react';

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({});

  const togglePreference = (tag) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [tag]: !prevPreferences[tag],
    }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, togglePreference }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
