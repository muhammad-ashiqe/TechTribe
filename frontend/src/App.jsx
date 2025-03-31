import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import MyProfile from "./pages/MyProfile";
import PostWithComments from "./pages/PostWithComments";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        {/* Protected Home Page */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/post/:postId" element={<PostWithComments />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
