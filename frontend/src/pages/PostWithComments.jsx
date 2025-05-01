import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocialContext } from '../context/context';
import { ArrowPathIcon, PaperAirplaneIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const PostWithComments = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { baseUrl, token, user } = useContext(SocialContext);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${baseUrl}/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal
        });

        if (!response?.data?._id) {
          throw new Error('Invalid post data structure');
        }

        // Normalize post data
        const normalizedPost = {
          ...response.data,
          user: response.data.user || { firstName: 'Unknown', lastName: 'User' },
          description: response.data.description || '',
          image: response.data.image || null,
          likes: response.data.likes || [],
          comments: response.data.comments || []
        };

        setPost(normalizedPost);
        setComments([...normalizedPost.comments].reverse());
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.response?.data?.message || err.message);
          console.error('Fetch error:', err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPostAndComments();

    return () => abortController.abort();
  }, [postId, baseUrl, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${baseUrl}/post/${postId}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle different API response structures
      const newCommentData = response.data.comment || response.data;
      
      if (!newCommentData?._id) {
        throw new Error('Invalid comment response structure');
      }

      setComments([newCommentData, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
      console.error('Comment error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ArrowPathIcon className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-400">
        <UserCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-xl font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Post Section */}
      {post && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
          {/* Post Header */}
          <div className="flex items-center mb-4">
            <img 
              src={post.user?.profilePic || '/default-avatar.png'}
              alt={post.user?.firstName}
              className="w-12 h-12 rounded-full mr-3 border-2 border-gray-700 hover:border-blue-400 transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/profile/${post.user?._id}`)}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                console.warn('Failed to load profile image');
              }}
            />
            <div>
              <h3 className="text-white font-semibold">
                {post.user.firstName} {post.user.lastName}
              </h3>
              <p className="text-gray-400 text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Post Content */}
          {post.description && (
            <p className="text-gray-100 mb-4 whitespace-pre-line">
              {post.description}
            </p>
          )}

          {/* Post Image */}
          {post.image && (
            <div className="relative mb-4">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full rounded-xl border border-gray-700 object-cover max-h-96"
                onError={(e) => {
                  console.error('Failed to load post image');
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Post Stats */}
          <div className="flex justify-between text-gray-400 text-sm border-t border-gray-700 pt-3">
            <span>{post.likes.length} Reactions</span>
            <span>{comments.length} Comments</span>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePic || '/default-avatar.png'}
            alt="Your profile"
            className="w-10 h-10 rounded-full border-2 border-gray-700"
            onError={(e) => e.target.src = '/default-avatar.png'}
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full bg-gray-800/50 text-white rounded-xl px-4 pr-12 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all duration-300"
              aria-label="Write a comment"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 p-2 hover:bg-gray-700/30 rounded-full transition-all duration-300"
              disabled={!newComment.trim()}
            >
              <PaperAirplaneIcon className="w-6 h-6 text-blue-400 rotate-45" />
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
            <p className="text-gray-400">No comments yet. Be the first to comment! 💬</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 shadow-lg">
              <div className="flex items-start gap-3">
                <img 
                  src={comment.user?.profilePic || '/default-avatar.png'} 
                  alt={comment.user?.firstName} 
                  className="w-10 h-10 rounded-full border-2 border-gray-700 cursor-pointer hover:border-blue-400 transition-all duration-300"
                  onClick={() => navigate(`/profile/${comment.user?._id}`)}
                  onError={(e) => e.target.src = '/default-avatar.png'}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm">
                      {comment.user?.firstName || 'Unknown'} {comment.user?.lastName || 'User'}
                    </h4>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostWithComments;