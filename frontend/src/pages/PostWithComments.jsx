import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostWithComments = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Get current user ID from token
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/post/${postId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPost(response.data);
        console.log(response.data);
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
        `http://localhost:7000/api/post/${postId}/comment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } } 
      );
      setComments(response.data.comments);
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <div className="text-center py-8 text-white">Loading...</div>;
  if (!post) return <div className="text-center py-8 text-white">Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Post */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <img 
            src={post.user.profilePic} 
            alt={post.user.firstName} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="text-white font-semibold">{post.user?.firstName} {post.user?.lastName}</h3>
            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-white mb-3">{post.description}</p>
        {post.image && (
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full rounded-md mb-3"
          />
        )}
        <div className="flex justify-between text-gray-400 text-sm">
          <span>{post.likes?.length || 0} Likes</span>
          <span>{comments.length} Comments</span>
        </div>
      </div>

      {/* Comment form */}
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-500 transition"
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <img 
                  src={comment.user?.profilePic || '/default-avatar.png'} 
                  alt={comment.user?.name} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <h4 className="text-white font-medium text-sm">{comment.user?.firstName}  {comment.user?.lastName}</h4>
                  <p className="text-gray-400 text-xs">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 pl-10">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostWithComments;
