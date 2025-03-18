import React from "react";
import Navbar from "../components/Navbar";
import LeftHomeSection from "../components/LeftHomeSection";
import MidHomeSection from "../components/MidHomeSection";
import RightHomeSection from "../components/RightHomeSection";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home flex w-full justify-center bg-black min-h-screen text-white p-10 gap-3">
        {/* left Home Sidebar */}
        <LeftHomeSection />

        {/* Middle Section */}
        <MidHomeSection />

        {/* Right Section (Empty for now) */}
       <RightHomeSection />
      </div>
    </>
  );
};

export default Home;
