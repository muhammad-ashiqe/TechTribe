import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocialContext } from "../context/context";
import { XMarkIcon, PhotoIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState(""); 
  const [image, setImage] = useState(null); 
  const [preview, setPreview] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const {baseUrl,token} = useContext(SocialContext)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description && !image) {
      toast.error("Please provide a description or upload an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${baseUrl}/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post created successfully!");

      setTimeout(() => {
        setLoading(false);
        setDescription("");
        setImage(null);
        setPreview(null);
        onClose(); // Close modal
      }, 500);
    } catch (error) {
      console.error("Error creating post:", error.response?.data?.message || error.message);
      toast.error("Failed to create post. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-700 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Post
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded-full transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none transition-all duration-200"
            rows="4"
          />

          {preview && (
            <div className="relative group">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-xl border border-gray-700 shadow-lg" 
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 p-2 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-all duration-200"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-3 rounded-xl transition-all duration-200">
              <PhotoIcon className="w-6 h-6 text-blue-400" />
              <span className="text-gray-300">Upload Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
                id="fileInput"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all duration-200 font-medium disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Create Post"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
