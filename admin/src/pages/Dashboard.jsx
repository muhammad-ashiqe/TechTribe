import React, { useContext, useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ChatBubbleOvalLeftIcon,
  UserPlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { SocialContext } from '../Context'

const iconMap = {
  users: <UserGroupIcon className="text-blue-400 w-6 h-6" />,
  activity: <ChartBarIcon className="text-emerald-400 w-6 h-6" />,
  post: <DocumentTextIcon className="text-purple-400 w-6 h-6" />,
  comment: <ChatBubbleOvalLeftIcon className="text-amber-400 w-6 h-6" />,
  'alert-circle': <ExclamationTriangleIcon className="text-rose-400 w-6 h-6" />,
  'user-plus': <UserPlusIcon className="text-cyan-400 w-6 h-6" />,
}

export default function Dashboard() {
  const [stats, setStats] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])
  const [postsData, setPostsData] = useState([])
  const [reportsData, setReportsData] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {baseUrl} = useContext(SocialContext)

  const base = `${baseUrl}/admin/dashboard`
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const endpoints = [
          `${base}/status`,
          `${base}/user-growth`,
          `${base}/post-per-day`,
          `${base}/report-per-day`,
          `${base}/latest-signup`,
          `${base}/latest-post`
        ]

        const responses = await Promise.all(endpoints.map(url => fetch(url)))
        
        // Check for HTTP errors
        const errorResponse = responses.find(r => !r.ok)
        if (errorResponse) {
          throw new Error(`Failed to fetch data: ${errorResponse.status}`)
        }

        const data = await Promise.all(responses.map(res => res.json()))

        // Destructure with proper data mapping
        const [
          { stats = [] },
          { chartData: userGrowth = [] },
          { chartData: posts = [] },
          { data: reports = [] },
          { recentUsers = [] },
          { recentPosts = [] }
        ] = data

        setStats(stats)
        setUserGrowthData(userGrowth)
        setPostsData(posts)
        setReportsData(reports)
        setRecentUsers(recentUsers)
        setRecentPosts(recentPosts)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const ChartSection = ({ title, data, dataKey, color }) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h4 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {title}
          </h4>
          <div className="text-gray-400 text-center py-8">No data available</div>
        </div>
      )
    }

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h4 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          {title}
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart 
            data={data} 
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              stroke="#4B5563" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              stroke="#4B5563" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ 
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={`url(#grad-${dataKey})`}
              strokeWidth={2}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-center">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((s, i) => {
            const icon = s?.icon || 'activity'
            const title = s?.title || 'N/A'
            const value = s?.value ?? 0
            
            return (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {value.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    {iconMap[icon]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartSection 
            title="User Growth" 
            data={userGrowthData} 
            dataKey="count" 
            color="#3B82F6" 
          />
          <ChartSection 
            title="Posts Per Day" 
            data={postsData} 
            dataKey="posts" 
            color="#8B5CF6" 
          />
          
          {/* Reports Per Day Chart */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h4 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Reports Per Day
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={reportsData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="grad-post" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="grad-user" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  stroke="#4B5563" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#4B5563" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ 
                    background: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="postReports"
                  stroke="#EF4444"
                  fill="url(#grad-post)"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  name="Post Reports"
                />
                <Area
                  type="monotone"
                  dataKey="userReports"
                  stroke="#3B82F6"
                  fill="url(#grad-user)"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  name="User Reports"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Signups */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h4 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Latest Signups
            </h4>
            <ul className="divide-y divide-gray-700">
              {recentUsers?.map?.(u => (
                <li key={u?.id} className="py-3 flex items-center gap-4 hover:bg-gray-800/30 px-2 rounded-lg transition-all duration-300">
                  <img 
                    src={u?.profilePic || '/default-avatar.png'} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full border-2 border-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-100">
                      {u?.firstName || 'Unknown'} {u?.lastName || 'User'}
                    </p>
                    <p className="truncate text-gray-400 text-sm">{u?.email || 'No email'}</p>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap">
                    {u?.signupDate ? new Date(u.signupDate).toLocaleDateString() : 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Posts */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
            <h4 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Latest Posts
            </h4>
            <ul className="divide-y divide-gray-700">
              {recentPosts?.map?.(p => (
                <li key={p?.postId} className="py-3 flex flex-col sm:flex-row justify-between gap-2 hover:bg-gray-800/30 px-2 rounded-lg transition-all duration-300">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-gray-100 truncate">
                      #{p?.postId} {p?.user || 'Unknown User'}
                    </p>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {p?.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="whitespace-nowrap">
                      {p?.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <div className="flex items-center gap-2">
                      <ChatBubbleOvalLeftIcon className="w-4 h-4 text-amber-400" />
                      <span>{p?.commentsCount || 0}</span>
                      <ChartBarIcon className="w-4 h-4 text-emerald-400" />
                      <span>{p?.likesCount || 0}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}