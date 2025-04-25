import { createContext } from "react";

// 1. Create the context
const SocialContext = createContext();

// 2. Create the provider component
const SocialContextProvider = ({ children }) => {
  const [user, setUser] = [];

  const fetchLoggedUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must log in.");
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        "http://localhost:7000/api/user/profile",
        config
      );
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
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // your context values go here
    user
  };

  return (
    <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
  );
};

// 3. Export both the provider and the context
export { SocialContextProvider, SocialContext };
