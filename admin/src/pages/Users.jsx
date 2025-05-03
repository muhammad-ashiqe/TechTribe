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

  const toggleBan = async (userId) => {
    // Optimistically update the UI
    const previousState = bannedUsers[userId]
    setBannedUsers(prev => ({ ...prev, [userId]: !prev[userId] }))

    try {
      const res = await fetch(`http://localhost:7000/api/admin/ban-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to update ban status')
      }

      const data = await res.json()
      
      // Confirm the state with server response
      setBannedUsers(prev => ({
        ...prev,
        [userId]: data.user.isBanned
      }))

    } catch (err) {
      console.error('Ban error:', err)
      // Revert UI state on error
      setBannedUsers(prev => ({
        ...prev,
        [userId]: previousState
      }))
    }
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              User Management
            </h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>{users.length} Total Users</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                <Activity className="w-5 h-5 text-green-400" />
                <span>{users.filter(u => u.lastActive > Date.now() - 86400000).length} Active Today</span>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10" />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className="group bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-900 hover:to-gray-800/80 rounded-2xl p-6 transition-all duration-300 border border-gray-700 shadow-xl hover:border-blue-500/30 relative"
            >
              {user.isOnline && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full ring-2 ring-gray-900 animate-pulse" />
              )}

              {user.isVerified && (
                <div className="absolute top-4 left-4 bg-blue-500/20 backdrop-blur-sm p-1.5 rounded-full border border-blue-400/30">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 a0.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}

              <div className="relative mx-auto mb-4 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity" />
                <img
                  src={user.profilePic}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="relative w-20 h-20 rounded-full border-2 border-indigo-500/80 object-cover shadow-lg"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-100 text-center mb-1">
                {user.firstName} {user.lastName}
                <span className="text-gray-400 text-sm block font-normal truncate">
                  {user.headline}
                </span>
              </h3>

              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                  <div className="text-indigo-400 font-semibold">{user.followers.length}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                <div className="text-center bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                  <div className="text-purple-400 font-semibold">{user.following.length}</div>
                  <div className="text-xs text-gray-400">Following</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => toggleBan(user._id)}
                  className={`w-full py-2 rounded-xl transition-all text-sm font-medium border ${
                    bannedUsers[user._id]
                      ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-400/30'
                      : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-400/30'
                  }`}
                >
                  {bannedUsers[user._id] ? 'Unban User' : 'Ban User'}
                </button>
                <Link
                  to={`/users/${user._id}`}
                  className="w-full py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-xl transition-colors text-sm font-medium text-center border border-gray-600/50"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700 shadow-xl">
            <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No users found matching your search</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users