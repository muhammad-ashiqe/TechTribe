import React from "react";
import Navbar from "../components/Navbar";
import LeftHomeSection from "../components/LeftHomeSection";
import MidHomeSection from "../components/MidHomeSection";
import RightHomeSection from "../components/RightHomeSection";

const Home = () => {
  return (
    <div className="relative bg-black text-white min-h-screen">
      <Navbar />
      
      <div className="h-[calc(100vh-4rem)] pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] xl:grid-cols-[1fr_2.5fr_1fr] h-full sm:px-35 ">
          {/* Left Sidebar */}
          <div className="hidden lg:block h-full overflow-y-auto sticky top-16">
            <LeftHomeSection />
          </div>

          {/* Middle Section */}
          <div className="h-full overflow-y-auto">
            <MidHomeSection />
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block h-full overflow-y-auto sticky top-16">
            <RightHomeSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;