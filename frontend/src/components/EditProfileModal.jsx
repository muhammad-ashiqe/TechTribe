// EditProfileModal.jsx
import React, { useState } from "react";
import axios from "axios";

const EditProfileModal = ({ user, onClose, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    headline: user.headline || "",
    location: user.location || "",
    phone: user.phone || "",
    website: user.website || "",
    bio: user.bio || "",
    profilePic: user.profilePic || "",
    coverPhoto: user.coverPhoto || "",
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update text field values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes for images
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePicFile") {
      setProfilePicFile(files[0]);
    } else if (name === "coverPhotoFile") {
      setCoverPhotoFile(files[0]);
    }
  };

  // Upload file via your backend (which uses Cloudinary)
  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const form = new FormData();
    form.append("file", file);
    const { data } = await axios.post("http://localhost:7000/api/update", form, config);
    return data.url;
  };

  // Submit the updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload images if new files were selected
      if (profilePicFile) {
        const profilePicUrl = await uploadFile(profilePicFile);
        formData.profilePic = profilePicUrl;
      }
      if (coverPhotoFile) {
        const coverPhotoUrl = await uploadFile(coverPhotoFile);
        formData.coverPhoto = coverPhotoUrl;
      }
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put("http://localhost:7000/api/user/update", formData, config);
      onProfileUpdated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
                required
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
                required
              />
            </div>
            {/* Headline */}
            <div>
              <label className="block mb-2">Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
              />
            </div>
            {/* Location */}
            <div>
              <label className="block mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
              />
            </div>
            {/* Website */}
            <div>
              <label className="block mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
              />
            </div>
            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 text-gray-900 rounded"
                rows="4"
              />
            </div>
            {/* Profile Picture Upload */}
            <div>
              <label className="block mb-2">Profile Picture</label>
              <input
                type="file"
                name="profilePicFile"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 text-gray-900 rounded"
              />
            </div>
            {/* Cover Photo Upload */}
            <div>
              <label className="block mb-2">Cover Photo</label>
              <input
                type="file"
                name="coverPhotoFile"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 text-gray-900 rounded"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
