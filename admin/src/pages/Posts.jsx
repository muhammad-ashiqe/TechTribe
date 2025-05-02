import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  FileText,
  Search,
  MessageCircle,
  Activity,
  Share2,
  AlertCircle,
  MoreVertical,
  Flag,
  Heart,
  BarChart2
} from 'lucide-react'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:7000/api/admin/fetch-all-posts')
        if (!res.ok) throw new Error('Failed to fetch posts')
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [posts])

 
  const deletePost=async(postId)=>{
    try {
      const res = await axios.delete(`http://localhost:7000/api/admin/posts/${postId}`);
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const filteredPosts = posts.filter(post =>
    post?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = date => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  if (loading) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 h-96">
                <div className="h-48 bg-gray-700 rounded-xl mb-4" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/4" />
                </div>
              </div>
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
          <h2 className="text-xl font-semibold text-gray-100 mb-2">Error Loading Posts</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >Retry</button>
        </div>
      </div>
    )
  }
  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Post Analytics
            </h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>{posts.length} Total Posts</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700">
                <Flag className="w-5 h-5 text-red-400" />
                <span>{posts.filter(p => p.reports?.length > 0).length} Reported</span>
              </div>
            </div>
          </div>
          
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10" />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Enhanced Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => {
            const user = post.user || {}
            const userName = user.username || [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown User'
            const profilePic = user.profilePic || '/default-avatar.png'

            return (
              <div
                key={post._id}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-900 hover:to-gray-800/80 rounded-2xl p-6 transition-all duration-300 border border-gray-700 shadow-xl hover:border-blue-500/30 flex flex-col"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity" />
                      <img
                        src={profilePic}
                        alt={userName}
                        className="relative w-10 h-10 rounded-full border-2 border-indigo-500/80 object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-gray-100 font-medium">{userName}</h4>
                      <span className="text-gray-400 text-xs">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-100 p-1 rounded-lg hover:bg-gray-700/50">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-gray-200 mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Post Image */}
                {post.image && (
                  <div className="relative w-full mb-4 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <img
                      src={post.image}
                      alt="post content"
                      className="w-full max-h-64 object-contain bg-gray-700/20"
                    />
                    {post.reports?.length > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-red-400/30">
                        <Flag className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">{post.reports.length}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Analytics */}
                <div className="grid grid-cols-3 gap-2 text-center mt-auto">
                  <div className="p-2 bg-gray-800/50 hover:bg-gray-700/30 rounded-lg border border-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-1 text-indigo-400">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{post.likes?.length || 0}</span>
                    </div>
                    <span className="text-xs text-gray-400">Likes</span>
                  </div>
                  <div className="p-2 bg-gray-800/50 hover:bg-gray-700/30 rounded-lg border border-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-1 text-green-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">{post.comments?.length || 0}</span>
                    </div>
                    <span className="text-xs text-gray-400">Comments</span>
                  </div>
                  <div className="p-2 bg-gray-800/50 hover:bg-gray-700/30 rounded-lg border border-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-1 text-purple-400">
                      <BarChart2 className="w-4 h-4" />
                      <span className="font-medium">{post.shares?.length || 0}</span>
                    </div>
                    <span className="text-xs text-gray-400">Shares</span>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/posts/${post._id}`}
                    className="flex-1 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-400 rounded-xl transition-all text-sm font-medium text-center border border-indigo-400/30 hover:border-indigo-400/50"
                  >
                    Analyze
                  </Link>
                  <button 
                  
                  onClick={()=>deletePost(post._id)}
                  
                  className="px-4 py-2 bg-red-700/50 hover:bg-red-700/70 text-gray-300 rounded-xl transition-colors text-sm font-medium border border-red-600/50">
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700 shadow-xl">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No posts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts