import React, { useState, useEffect, useContext } from "react";
import {
  Flag,
  User,
  FileText,
  Search,
  AlertCircle,
  MoreVertical,
  XCircle,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { SocialContext } from "../Context";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("post");
  const [openDropdownId, setOpenDropdownId] = useState(null);
     const {baseUrl} = useContext(SocialContext)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const endpoint =
          filterType === "post"
            ? `${baseUrl}/admin/reports/posts`
            : `${baseUrl}/admin/reports/users`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const { data } = await res.json();
        setReports(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [filterType]);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      const res = await fetch(
        `${baseUrl}/admin/reports/${reportId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newStatus,
            reportType: filterType,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      setReports(
        reports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
    }
    setOpenDropdownId(null);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-red-500/20 text-red-400 border-red-400/30",
      reviewed: "bg-amber-500/20 text-amber-400 border-amber-400/30",
      resolved: "bg-green-500/20 text-green-400 border-green-400/30",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${statusStyles[status]}`}
      >
        {status === "pending" && <ShieldAlert className="w-4 h-4" />}
        {status === "reviewed" && <CheckCircle2 className="w-4 h-4" />}
        {status === "resolved" && <XCircle className="w-4 h-4" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      report.reason.toLowerCase().includes(searchLower) ||
      (filterType === "post"
        ? report.reportedPost?.description
            ?.toLowerCase()
            .includes(searchLower) ||
          report.reportedPost?.user?.firstName
            ?.toLowerCase()
            .includes(searchLower) ||
          report.reportedPost?.user?.lastName
            ?.toLowerCase()
            .includes(searchLower)
        : report.reportedUser?.firstName?.toLowerCase().includes(searchLower) ||
          report.reportedUser?.lastName?.toLowerCase().includes(searchLower) ||
          report.reportedUser?.email?.toLowerCase().includes(searchLower))
    );
  });

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
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="max-w-md bg-gray-800 p-6 rounded-2xl text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            Error Loading Reports
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Reported Content
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("post")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === "post"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/30 border border-gray-700"
                }`}
              >
                <FileText className="inline-block w-5 h-5 mr-2" />
                Post Reports (
                {filteredReports.filter((r) => r.type === "post").length})
              </button>
              <button
                onClick={() => setFilterType("user")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === "user"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/30 border border-gray-700"
                }`}
              >
                <User className="inline-block w-5 h-5 mr-2" />
                User Reports (
                {filteredReports.filter((r) => r.type === "user").length})
              </button>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10" />
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${filterType} reports...`}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="group bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-900 hover:to-gray-800/80 rounded-2xl p-6 transition-all duration-300 border border-gray-700 shadow-xl hover:border-blue-500/30 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={report.reportedBy.profilePic}
                    alt="Reporter"
                    className="w-10 h-10 rounded-full border-2 border-indigo-500/80 object-cover"
                  />
                  <div>
                    <h4 className="text-gray-100 font-medium">
                      {report.reportedBy.firstName} {report.reportedBy.lastName}
                    </h4>
                    <span className="text-gray-400 text-xs">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(report.status)}
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === report._id ? null : report._id
                        )
                      }
                      className="p-1 hover:bg-gray-700/50 rounded-lg"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {openDropdownId === report._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() =>
                            handleStatusUpdate(report._id, "pending")
                          }
                          className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          Mark Pending
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(report._id, "reviewed")
                          }
                          className="w-full px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 rounded-lg flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(report._id, "resolved")
                          }
                          className="w-full px-3 py-2 text-sm text-green-400 hover:bg-green-500/10 rounded-lg flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <p className="text-gray-300 text-sm italic">
                  "{report.reason}"
                </p>
              </div>

              {filterType === "post" ? (
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                   
                    <img
                      src={report.reportedPost?.user?.profilePic}
                      className="w-8 h-8 rounded-full border border-indigo-500/30"
                      alt="Post author"
                    />
                    <span className="text-gray-300 text-sm">
                      {report.reportedPost?.user?.firstName}{" "}
                      {report.reportedPost?.user?.lastName}
                    </span>
                  </div>
                   <div className="mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                      <p className="text-gray-300 text-sm italic">
                        "{report.reportedPost._id}"
                      </p>
                    </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {report.reportedPost?.description}
                  </p>
                  {report.reportedPost?.image && (
                    <img
                      src={report.reportedPost?.image}
                      className="mt-3 rounded-lg max-h-32 w-full object-cover"
                      alt="Post content"
                    />
                  )}
                </div>
              ) : (
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={report.reportedUser?.profilePic}
                      className="w-8 h-8 rounded-full border border-purple-500/30"
                      alt="Reported user"
                    />
                    <div>
                      <h4 className="text-gray-300">
                        {report.reportedUser?.firstName}{" "}
                        {report.reportedUser?.lastName}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {report.reportedUser?.email}
                      </p>
                    </div>
                    
                  </div>
                  <div className="mt-3 text-sm space-y-1">
                    {report.reportedUser?.headline && (
                      <p className="text-gray-400">
                        {report.reportedUser?.headline}
                      </p>
                    )}
                    {report.reportedUser?.location && (
                      <p className="text-gray-400 flex items-center gap-1">
                        {report.reportedUser?.location}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                      <p className="text-gray-300 text-sm italic">
                        "{report.reportedUser?._id}"
                      </p>
                    </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-700 shadow-xl">
            <Flag className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No {filterType} reports found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
