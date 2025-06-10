import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useContext } from "react";
import { SocialContext } from "../context/context";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const { baseUrl } = useContext(SocialContext);
  const [particles, setParticles] = useState([]);

  // Create floating particles for background effect
  useEffect(() => {
    const createParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speed: Math.random() * 2 + 0.5,
      }));
      setParticles(newParticles);
    };

    createParticles();
    window.addEventListener("resize", createParticles);
    return () => window.removeEventListener("resize", createParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const moveParticles = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: (p.y + p.speed) % window.innerHeight
      })));
    };
    
    const interval = setInterval(moveParticles, 50);
    return () => clearInterval(interval);
  }, [particles]);

  // Verify email token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setStatus("invalid");
          toast.error("Missing verification token");
          return;
        }

        const response = await axios.get(`${baseUrl}/user/verify-email`, {
          params: { token }
        });
        
        if (response.data.message) {
          setStatus("success");
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        toast.error(
          error.response?.data?.message || 
          "Verification failed. The link may have expired."
        );
      }
    };

    // Add slight delay for better UX
    const timer = setTimeout(verifyToken, 1000);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-blue-500 opacity-20"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
      
      {/* Glowing orb effect */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px] opacity-10 animate-pulse"></div>
      
      {/* Main card */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-gray-800/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50 transform transition-all duration-700 hover:shadow-blue-500/20 hover:border-blue-500/30">
        {/* Animated header */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent relative z-10">
              Email Verification
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-400 mt-2">
            {status === "verifying" ? "Confirming your identity..." : 
             status === "success" ? "Your account is now secured" :
             status === "invalid" ? "Verification required" : 
             "Verification issue detected"}
          </p>
        </div>

        <div className="text-center mt-12">
          {/* Verifying state */}
          {status === "verifying" && (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="relative">
                <ClipLoader size={70} color="#6366f1" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
              </div>
              <p className="mt-6 text-lg text-gray-300">
                Verifying your email address...
              </p>
              <div className="mt-6 h-1 w-48 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"></div>
              </div>
            </div>
          )}

          {/* Success state */}
          {status === "success" && (
            <div className="flex flex-col items-center animate-scaleIn">
              <div className="relative">
                <svg
                  className="h-28 w-28 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping"></div>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-100">
                Email Verified Successfully!
              </h3>
              <p className="mt-4 text-gray-400 max-w-md">
                Your email address has been verified and your account is now secured.
                You can now access all features of our platform.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Invalid state */}
          {status === "invalid" && (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="relative">
                <svg
                  className="h-28 w-28 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="absolute inset-0 rounded-full bg-yellow-500/10 animate-pulse"></div>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-100">
                Invalid Verification Link
              </h3>
              <p className="mt-4 text-gray-400 max-w-md">
                The verification link is missing or invalid. Please check your email for the correct verification link.
              </p>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2.5 bg-gray-700 text-gray-300 font-medium rounded-xl hover:bg-gray-600 transition-all"
                >
                  Go Home
                </button>
                <button
                  onClick={() => navigate("/auth")}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="relative">
                <svg
                  className="h-28 w-28 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse"></div>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-100">
                Verification Failed
              </h3>
              <p className="mt-4 text-gray-400 max-w-md">
                The verification link may have expired or is invalid. Please request a new verification link from your account settings.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center text-gray-500 text-sm">
        <p>© 2023 TechTribe. All rights reserved.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;