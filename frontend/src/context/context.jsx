import axios from "axios";
import { createContext, useEffect, useState } from "react";

// 1. Create the context
const SocialContext = createContext();

// 2. Create the provider component
const SocialContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const baseUrl = "http://localhost:7000/api";
  
  const fetchLoggedUserProfile = async () => {
    try {
      if (!token) {
        console.error("No token found. User must log in.");
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${baseUrl}/user/profile`, config);
      setUser(data);
    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error.response?.data?.message || error.message
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  fetchLoggedUserProfile();
  const value = {
    // your context values go here
    user,
    baseUrl,
    token
  };

  return (
    <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
  );
};

// 3. Export both the provider and the context
export { SocialContextProvider, SocialContext};

