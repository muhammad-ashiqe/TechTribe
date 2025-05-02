import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SocialContext = createContext();

export const SocialContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );
  const baseUrl = "http://localhost:7000/api";

  // Sync localStorage → state once on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored && stored !== token) {
      setToken(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever token changes: either fetch profile or redirect to /auth
  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const value = {
    user,
    token,
    setToken,
    baseUrl,
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
};
