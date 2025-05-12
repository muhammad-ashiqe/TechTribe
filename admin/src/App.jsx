// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { SocialContext } from "./Context";

// Components
import AdminLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import Reports from "./pages/Reports";
import { Sidebar } from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AuthLoader from "./components/AuthLoader";

const ProtectedRoute = ({ children }) => {
  const { adminToken, authChecked } = useContext(SocialContext);

  if (!authChecked) return <AuthLoader />;
  if (!adminToken) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { adminToken, authChecked } = useContext(SocialContext);
  
  if (!authChecked) return <AuthLoader />;
  if (adminToken) return <Navigate to="/dashboard" replace />;
  
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Other protected routes */}
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}