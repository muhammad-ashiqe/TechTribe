import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [bannedUsers, setBannedUsers] = useState({})

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:7000/api/admin/fetch-all-users')
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        setUsers(data)
        const initialBans = {}
        data.forEach(u => {
          initialBans[u._id] = !!u.isBanned
        })
        setBannedUsers(initialBans)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const toggleBan = (userId) => {
    setBannedUsers(prev => ({ ...prev, [userId]: !prev[userId] }))
    // TODO: call ban/unban endpoint here
  }

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-800 rounded-lg w-1/4 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md bg-gray-800 p-6 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-100 mb-2">Loading Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">User Management</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>{users.length} Total Users</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-5 h-5 text-green-400" />
                <span>{users.filter(u => u.lastActive > Date.now() - 86400000).length} Active Today</span>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className="group bg-gray-800/50 hover:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 border border-gray-700/50 hover:border-gray-600 relative"
            >
              {user.isOnline && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full ring-2 ring-gray-900" />
              )}
              {user.isVerified && (
                <div className="absolute top-4 left-4 bg-blue-500/20 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 a0.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}

              <img
                src={user.profilePic}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-indigo-500/80 object-cover shadow-lg"
              />

              <h3 className="text-lg font-semibold text-gray-100 text-center mb-1">
                {user.firstName} {user.lastName}
                <span className="text-gray-400 text-sm block font-normal truncate">{user.jobTitle}</span>
              </h3>

              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-indigo-400 font-semibold">{user.followers.length}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{user.following.length}</div>
                  <div className="text-xs text-gray-400">Following</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
              
                <button
                  onClick={() => toggleBan(user._id)}
                  className={`w-full py-2 rounded-lg transition-colors text-sm font-medium ${
                    bannedUsers[user._id]
                      ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                      : 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                  }`}
                >
                  {bannedUsers[user._id] ? 'Unban' : 'Ban'}
                </button>
                <Link
                  to={`/users/${user._id}`}
                  className="w-full py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg transition-colors text-sm font-medium text-center"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UsersIcon className="w-12 h-12 mx-auto mb-4" />
            No users found matching your search
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
