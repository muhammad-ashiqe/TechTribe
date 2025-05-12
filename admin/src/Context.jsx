// Context.js
import { createContext, useEffect, useState } from "react";

export const SocialContext = createContext();

export const SocialContextProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for existing token on mount and storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      setAdminToken(token);
      if (!authChecked) setAuthChecked(true);
    };

    // Initial check
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [authChecked]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  const value = {
    adminToken,
    setAdminToken,
    authChecked,
    logout
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
};