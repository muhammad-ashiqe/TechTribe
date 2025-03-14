import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authServices";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser({ email: formData.email, password: formData.password });
      } else {
        await registerUser(formData);
      }
      navigate("/home"); // Redirect to Home after login/register
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Logo or Icon */}
      <div className="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold mb-4 animate-fade-in">
        {isLogin ? "Login" : "Register"}
      </h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 mb-4 animate-fade-in">{error}</p>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 animate-fade-in delay-100"
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-700 text-white border border-gray-600 p-3 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-700 text-white border border-gray-600 p-3 mb-4 rounded-lg focus:outline-none focus:border-blue-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-700 text-white border border-gray-600 p-3 mb-6 rounded-lg focus:outline-none focus:border-blue-500"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      {/* Toggle between Login and Register */}
      <p className="mt-6 text-gray-400 animate-fade-in delay-200">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-500 hover:underline focus:outline-none"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default Auth;