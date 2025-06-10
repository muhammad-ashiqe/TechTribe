import React, { useContext, useState, useEffect } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SocialContext } from "../context/context";

const Notifications = () => {
  const { user } = useContext(SocialContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        // Mock notifications data
        const mockData = [
          // { id: 1, text: "Alex Johnson liked your post", time: "5m ago", read: false },
          // { id: 2, text: "Taylor Smith commented on your photo", time: "2h ago", read: true },
          // { id: 3, text: "Jordan Williams started following you", time: "1d ago", read: false },
        ];
        setNotifications(mockData);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="animate-pulse space-y-4 w-11/12 max-w-md p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 bg-gray-700 rounded-full" />
            <div className="h-5 bg-gray-700 rounded-full w-32" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="h-4 bg-gray-700 rounded-full w-4/5 mb-2" />
              <div className="h-3 bg-gray-700 rounded-full w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl border border-gray-700 p-6 text-center w-11/12 max-w-sm">
          <XMarkIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">Failed to load notifications</h3>
          <p className="text-gray-400 text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-auto p-4 sm:p-8 md:p-12">
      <div className="mx-auto w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
        <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center gap-2">
          <BellIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-white font-bold text-lg sm:text-xl">Notifications</h2>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-gray-800/50 border border-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white font-medium mb-1 text-base sm:text-lg">No notifications</h3>
            <p className="text-gray-400 text-sm sm:text-base">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 sm:p-6 ${!notification.read ? "bg-blue-900/10" : ""}`}
              >
                <p className="text-white mb-1 text-sm sm:text-base">{notification.text}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{notification.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
