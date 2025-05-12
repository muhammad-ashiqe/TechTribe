// components/AuthLoader.jsx
const AuthLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
      <p className="text-gray-300">Checking authentication status...</p>
    </div>
  </div>
);

export default AuthLoader;