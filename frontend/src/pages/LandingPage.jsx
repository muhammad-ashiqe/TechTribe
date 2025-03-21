import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  // Framer Motion variants for hero elements
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Variants for feature cards
  const featureVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const features = [
    {
      title: "Connect & Network",
      description:
        "Meet tech professionals from various industries and expand your network globally.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
        </svg>
      ),
    },
    {
      title: "Collaborate & Innovate",
      description:
        "Join dynamic conversations, share your expertise, and drive innovation in tech.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m-4-4v8" />
        </svg>
      ),
    },
    {
      title: "Stay Informed",
      description:
        "Access the latest industry insights, news, and expert opinions to keep you ahead.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden relative">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-6 z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-blue-500">Tech Tribe</span>
        </motion.h1>
        <motion.p
          className="max-w-xl text-lg md:text-2xl mb-8 text-gray-300"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.3 }}
        >
          Connecting tech professionals from various industries. Share your passion,
          collaborate on innovative projects, and stay ahead in the tech world.
        </motion.p>
        <div className="flex flex-col md:flex-row gap-4">
          <motion.button
            onClick={() => navigate("/auth")}
            className="px-8 py-3 bg-blue-500 rounded-full text-lg font-semibold hover:bg-blue-600 transition-all transform hover:scale-105"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.6 }}
          >
            Get Started
          </motion.button>
          <motion.button
            onClick={() => navigate("/explore")}
            className="px-8 py-3 bg-transparent border border-blue-500 rounded-full text-lg font-semibold hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.9 }}
          >
            Know More
          </motion.button>
        </div>
      </div>

      {/* Background Image Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-50"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 md:px-12 bg-gray-900 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={heroVariants}
          transition={{ duration: 1 }}
        >
          What We Offer
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={featureVariants}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 bg-gray-800 text-center">
        <motion.p
          className="text-gray-500 text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={heroVariants}
          transition={{ duration: 1, delay: 0.5 }}
        >
          © {new Date().getFullYear()} Tech Tribe. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default LandingPage;
