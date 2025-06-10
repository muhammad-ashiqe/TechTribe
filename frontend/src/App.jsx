import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import MyProfile from "./pages/MyProfile";
import PostWithComments from "./pages/PostWithComments";
import UserProfile from "./pages/UserProfile";
import VerifyEmail from "./pages/VerifyEmail";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <>
      <ToastContainer  position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"/>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Protected Home Page */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/post/:postId" element={<PostWithComments />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
