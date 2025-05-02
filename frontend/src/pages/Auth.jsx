import { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { useContext } from "react";
import { SocialContext } from "../context/context";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {setToken} = useContext(SocialContext)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
  const navigate = useNavigate();

  // Array of images for the carousel
  const images = [
    "https://wallpapershome.com/images/pages/pic_v/12585.jpg",
    "https://wallpapershome.com/images/pages/pic_v/12586.jpg",
    "https://i.pinimg.com/736x/37/0e/92/370e92cc04960a8e560e857fc6820d2b.jpg",
  ];

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);

  // Update time left every second
  useEffect(() => {
    const timer = setInterval(() => {
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [currentImageIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login user
       const response = await loginUser({ email: formData.email, password: formData.password });
       setToken(response.token);
        toast.success("Login successful! Welcome back."); // Success toast
      } else {
        // Register user
        const response = await registerUser(formData);
        setToken(response.token);
        toast.success("Registration successful! Welcome to our platform."); // Success toast
      }
     
      // 2) navigate to home
      navigate("/", { replace: true });
    } catch (err) {
      // Display error toast
      console.log(err);
      toast.error(err.response.data.message || "An error occurred. Please try again.");
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
      <div className="container flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Left Container - Image Carousel (Hidden on Mobile) */}
        <div className="hidden md:block w-full md:w-1/2 p-3 relative">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <img
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              src={images[currentImageIndex]} // Use current image from the array
              alt="Background"
            />
          </div>


          {/* Progress Bars */}
          <div className="absolute bottom-10 right-35 flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full ${
                  index === currentImageIndex
                    ? "bg-white" // Active bar
                    : "bg-gray-500" // Inactive bar
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Container - Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
            <p className="text-gray-400">
              {isLogin ? "Log in to continue" : "Sign up to get started"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-1/2 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-1/2 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {!isLogin && (
              <div className="flex items-center justify-center">
                <input type="checkbox" id="terms" className="mr-2" required checked/>
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the terms and conditions
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:underline"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-4 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-4">
            <button className="w-1/2 flex items-center justify-center bg-gray-700 py-3 rounded-lg hover:bg-gray-600 transition duration-300">
              <img
                src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              <span>Google</span>
            </button>
            <button className="w-1/2 flex items-center justify-center bg-gray-700 py-3 rounded-lg hover:bg-gray-600 transition duration-300">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
                alt="LinkedIn"
                className="w-6 h-6 mr-2"
              />
              <span>LinkedIn</span>
            </button>
          </div>
        
        </div>
       
      </div>
    </div>
  );
};

export default Auth;