import React from "react";
import Navbar from "../components/Navbar";
import LeftHomeSection from "../components/LeftHomeSection";
import MidHomeSection from "../components/MidHomeSection";
import RightHomeSection from "../components/RightHomeSection";

const Home = () => {
  return (
    <div className="relative">
      <Navbar className="fixed z-10"/>
      <div className="home flex w-full justify-center bg-black min-h-screen text-white p-10 gap-3">
        {/* left Home Sidebar */}
        <LeftHomeSection className="fixed"/>

        {/* Middle Section */}
        <MidHomeSection className="overflow-y-scroll"/>

        {/* Right Section (Empty for now) */}
       <RightHomeSection className="fixed"/>
      </div>
    </div>
  );
};

export default Home;
