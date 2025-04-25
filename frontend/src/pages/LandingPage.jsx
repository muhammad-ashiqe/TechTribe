import React, { useState, useEffect } from "react";
import landingImage from "../../public/landing.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white min-h-screen font-sans overflow-x-hidden">
      {/* Modern Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md py-3 border-b border-gray-800"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-white flex items-center">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              TechTribe
            </span>
          </div>
          
          {/* Mobile menu button */}
          <button className="lg:hidden text-gray-300 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            <ul className="flex gap-8 text-gray-300 font-medium">
              <li className="hover:text-white transition cursor-pointer hover:scale-105">Home</li>
              <li className="hover:text-white transition cursor-pointer hover:scale-105">Features</li>
              <li className="hover:text-white transition cursor-pointer hover:scale-105">Community</li>
              <li className="hover:text-white transition cursor-pointer hover:scale-105">Blog</li>
              <li className="hover:text-white transition cursor-pointer hover:scale-105">Contact</li>
            </ul>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-gray-800 text-xs font-semibold text-purple-400 tracking-wider">
            NEW PLATFORM • JOIN TODAY
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
              Connect. Share.
            </span>{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Thrive.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            TechTribe is your social home for everything IT. Join the tribe of tech enthusiasts,
            share your thoughts, collaborate, learn, and build your professional network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button onClick={()=>navigate('/home')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-200 font-medium py-3 px-8 rounded-full hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              See How It Works
            </button>
          </div>

          {/* Visual Element */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-lg opacity-75"></div>
            <img
              src={landingImage}
              alt="TechTribe platform preview"
              className="relative mx-auto rounded-2xl shadow-2xl border border-gray-700/50 w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: "120K+", label: "Tech Professionals" },
              { value: "3M+", label: "Posts Shared" },
              { value: "50+", label: "Industries Connected" },
              { value: "99%", label: "Positive Feedback" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">TechTribe?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Whether you're a software engineer, data analyst, designer, or DevOps pro — TechTribe
              gives you the tools and space to thrive together.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Smart Feed",
                description: "Get tailored posts and updates that match your field and interests.",
                icon: "🔍",
              },
              {
                title: "Collaborative Posts",
                description: "Like, comment, and repost insights from other tech pros.",
                icon: "💬",
              },
              {
                title: "Verified Communities",
                description: "Join industry-based communities to grow your expertise.",
                icon: "✅",
              },
              {
                title: "Real-Time Chats",
                description: "Instantly connect and brainstorm with peers across the globe.",
                icon: "⚡",
              },
              {
                title: "Event Discovery",
                description: "Find and join webinars, meetups, and hackathons tailored to your interests.",
                icon: "📅",
              },
              {
                title: "Growth Tracking",
                description: "Set your goals and track your personal and professional growth.",
                icon: "📈",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="text-3xl mb-4 group-hover:text-purple-400 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Community</span> Says
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "TechTribe transformed how I network in the tech industry. Made so many valuable connections!",
                author: "Sarah K., Frontend Developer",
                role: "Google",
              },
              {
                quote: "The communities here are goldmines of knowledge. Found solutions to problems I've struggled with for weeks.",
                author: "Michael T., DevOps Engineer",
                role: "Amazon Web Services",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="text-purple-400 text-4xl mb-4">"</div>
                <p className="text-gray-300 text-lg mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 -skew-y-3"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Tribe?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Sign up now and become a part of the fastest-growing tech community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-10 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
                Join TechTribe Today
              </button>
              <button className="border border-gray-600 hover:border-gray-500 text-gray-200 font-medium py-4 px-10 rounded-full hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">TechTribe</h3>
              <p className="text-gray-400">
                Connect with tech professionals worldwide and grow together in your career.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} TechTribe. All rights reserved. Connect. Share. Thrive.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;