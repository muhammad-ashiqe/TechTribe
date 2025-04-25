import React, { useEffect, useState } from 'react'
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
  Activity,
  Users,
  AlertCircle,
  MessageCircle,
  UserPlus,
  FileText
} from 'lucide-react'

const iconMap = {
  users: <Users className="text-blue-400 w-6 h-6" />,
  activity: <Activity className="text-emerald-400 w-6 h-6" />,
  post: <FileText className="text-purple-400 w-6 h-6" />,
  comment: <MessageCircle className="text-amber-400 w-6 h-6" />,
  'alert-circle': <AlertCircle className="text-rose-400 w-6 h-6" />,
  'user-plus': <UserPlus className="text-cyan-400 w-6 h-6" />,
}

export default function Dashboard() {
  const [stats, setStats] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])
  const [postsData, setPostsData] = useState([])
  const [reportsData, setReportsData] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [recentPosts, setRecentPosts] = useState([])

  const base = 'http://localhost:7000/api/admin/dashboard'
  useEffect(() => {
    ;(async () => {
      const [s, ug, ppd, rpd, lu, lp] = await Promise.all([
        fetch(`${base}/status`).then(r => r.json()),
        fetch(`${base}/user-growth`).then(r => r.json()),
        fetch(`${base}/post-per-day`).then(r => r.json()),
        fetch(`${base}/report-per-day`).then(r => r.json()),
        fetch(`${base}/latest-signup`).then(r => r.json()),
        fetch(`${base}/latest-post`).then(r => r.json())
      ])
      setStats(s.stats)
      setUserGrowthData(ug.chartData)
      setPostsData(ppd.chartData)
      setReportsData(rpd.chartData)
      setRecentUsers(lu.recentUsers)
      setRecentPosts(lp.recentPosts)
    })()
  }, [])

  const ChartSection = ({ title, data, dataKey, color }) => (
    <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h4 className="text-gray-200 font-medium mb-2 sm:mb-3">{title}</h4>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} />
          <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ background: '#1f1f2e', border: 'none', borderRadius: 6 }}
            itemStyle={{ color: '#eee' }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fillOpacity={1}
            fill={`url(#grad-${dataKey})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 bg-gray-900 text-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{s.title}</p>
                  <p className="text-2xl font-semibold text-gray-100">{s.value}</p>
                </div>
                <div className="p-2 sm:p-3 bg-gray-700 rounded-full">
                  {iconMap[s.icon]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <ChartSection title="User Growth" data={userGrowthData} dataKey="count" color="#3B82F6" />
          <ChartSection title="Posts Per Day" data={postsData} dataKey="posts" color="#8B5CF6" />
          <ChartSection title="Reports Per Day" data={reportsData} dataKey="reports" color="#EF4444" />
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Latest Signups */}
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg overflow-x-auto">
            <h4 className="text-gray-200 font-medium mb-3">Latest Signups</h4>
            <ul className="divide-y divide-gray-700">
              {recentUsers.map(u => (
                <li key={u.id} className="py-3 flex items-center space-x-3 sm:space-x-4">
                  <img src={u.profilePic} alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-100">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="truncate text-gray-400 text-xs sm:text-sm">{u.email}</p>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {new Date(u.signupDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Posts */}
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg overflow-x-auto">
            <h4 className="text-gray-200 font-medium mb-3">Latest Posts</h4>
            <ul className="divide-y divide-gray-700">
              {recentPosts.map(p => (
                <li key={p.postId} className="py-3 flex flex-col sm:flex-row sm:justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-gray-100 truncate">#{p.postId} {p.user}</p>
                    <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{p.description}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center sm:flex-col sm:items-end space-x-4 sm:space-x-0 sm:space-y-1 text-xs sm:text-sm text-gray-400">
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />{p.commentsCount}
                      <Activity className="w-4 h-4" />{p.likesCount}
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