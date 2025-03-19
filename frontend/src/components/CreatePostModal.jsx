import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState(""); 
  const [image, setImage] = useState(null); 
  const [preview, setPreview] = useState(null); 
  const [loading, setLoading] = useState(false); 

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
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:7000/api/post/create", formData, {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Create Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="What's happening?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
          {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />}
          <input type="file" accept="image/*" onChange={handleImageChange} className="text-white bg-gray-800 p-2 rounded-lg w-full cursor-pointer" />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center" disabled={loading}>
              {loading ? "Posting..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
