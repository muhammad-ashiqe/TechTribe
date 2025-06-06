import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiHeart, FiMessageCircle, FiSend, FiSmile } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { useContext } from 'react';
import { SocialContext } from '../context/context';

const PostWithComments = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const {baseUrl} = useContext(SocialContext)

  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/post/${postId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${baseUrl}/post/${postId}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setComments(response.data.comments);
      setNewComment('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewComment(prev => prev + emojiData.emoji);
  };

  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!post) return (
    <div className="text-center py-8 px-4">
      <div className="max-w-md mx-auto p-6 bg-rose-500/10 rounded-xl">
        <p className="text-rose-500 text-lg font-semibold">Post not found</p>
        <p className="text-gray-400 mt-2">The post you're looking for might have been removed</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Post */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl shadow-2xl p-6 mb-8
        border border-gray-700/50 hover:border-gray-700/70 transition-colors">
        <div className="flex items-center mb-4">
          <div className="relative group">
            <img 
              src={post.user.profilePic} 
              alt={post.user.firstName} 
              className="w-12 h-12 rounded-full mr-3 border-2 border-blue-500/30
                hover:border-blue-500/50 transition-colors"
            />
            <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
          </div>
          <div>
            <h3 className="text-white font-bold">{post.user?.firstName} {post.user?.lastName}</h3>
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
        
        <p className="text-gray-100 mb-4 text-lg break-words">{post.description}</p>
        
        {post.image && (
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full rounded-xl mb-4 aspect-video object-cover border border-gray-700/50
              hover:border-gray-700/70 transition-colors"
          />
        )}
        
        <div className="flex items-center justify-between text-gray-400 mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-2 hover:text-rose-500 transition-colors cursor-pointer">
            <FiHeart className="text-rose-500" />
            <span>{post.likes?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-blue-500 transition-colors cursor-pointer">
            <FiMessageCircle className="text-blue-500" />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Comment form */}
      <form onSubmit={handleCommentSubmit} className="mb-8 group relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-800 text-white rounded-xl px-5 py-3 border border-gray-700/50 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all
                placeholder-gray-500 group-hover:border-gray-600 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-3 text-gray-400 hover:text-blue-500 transition-colors p-2"
            >
              <FiSmile className="text-xl" />
            </button>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-500 
              transition-all flex items-center gap-2 hover:scale-95 active:scale-90
              shadow-lg shadow-blue-500/20"
          >
            <FiSend className="text-lg" />
            <span className="hidden md:inline">Send</span>
          </button>
        </div>

        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 left-0 z-10">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height={350}
              searchDisabled
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
              theme="dark"
            />
          </div>
        )}
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {sortedComments.length === 0 ? (
          <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-dashed border-gray-700/50
            hover:border-gray-700/70 transition-colors">
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts! 💬</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <div 
              key={comment._id} 
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 hover:border-gray-700/50
                transition-all group relative hover:bg-gray-800/70"
            >
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500/20 rounded-r-xl
                group-hover:bg-blue-500/30 transition-colors"></div>
              
              <div className="flex items-start ml-3">
                <img 
                  src={comment.user?.profilePic || '/default-avatar.png'} 
                  alt={comment.user?.name} 
                  className="w-9 h-9 rounded-full mr-3 border-2 border-blue-500/20
                    hover:border-blue-500/30 transition-colors"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h4 className="text-white font-medium text-sm">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </h4>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm break-words">{comment.text}</p>
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