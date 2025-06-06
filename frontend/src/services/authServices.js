import axios from "axios";

const API_URL = "https://techtribe-backend.onrender.com/api/user";

export const loginUser = async (formData) => {
  const { data } = await axios.post(`${API_URL}/login`, formData);
  localStorage.setItem("token", data.token);
  return data;  // { token, user? }
};

export const registerUser = async (formData) => {
  const { data } = await axios.post(`${API_URL}/register`, formData);
  localStorage.setItem("token", data.token);
  return data;
};
