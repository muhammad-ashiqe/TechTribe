import React, { useContext, useState } from "react";
import axios from "axios";
import { SocialContext } from "../context/context";
import { XMarkIcon, UserCircleIcon, PhotoIcon, GlobeAltIcon, DevicePhoneMobileIcon, LinkIcon, MapPinIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

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
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { baseUrl, token } = useContext(SocialContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (name === "profilePicFile") {
        setProfilePicPreview(reader.result);
        setProfilePicFile(file);
      } else if (name === "coverPhotoFile") {
        setCoverPhotoPreview(reader.result);
        setCoverPhotoFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type) => {
    if (type === 'profile') {
      setProfilePicPreview(null);
      setProfilePicFile(null);
    } else {
      setCoverPhotoPreview(null);
      setCoverPhotoFile(null);
    }
  };

  // Submit the updated profile (combined text and file data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // Create FormData and include text fields
      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("headline", formData.headline);
      form.append("location", formData.location);
      form.append("phone", formData.phone);
      form.append("website", formData.website);
      form.append("bio", formData.bio);

      // Include current image URLs as fallback values
      form.append("profilePic", formData.profilePic);
      form.append("coverPhoto", formData.coverPhoto);

      // Append file inputs using the exact field names expected by the backend
      if (profilePicFile) {
        form.append("profilePicFile", profilePicFile);
      }
      if (coverPhotoFile) {
        form.append("coverPhotoFile", coverPhotoFile);
      }

      // Send the PUT request to the correct update endpoint
      const { data } = await axios.put(
        `${baseUrl}/user/update`,
        form,
        config
      );

      // Call the callback to update profile state in parent and close modal
      onProfileUpdated(data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-3xl mx-4 shadow-2xl border border-gray-700 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded-full transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 rounded-xl flex items-center gap-2 text-red-300 text-sm">
            <XMarkIcon className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                required
              />
            </div>

            {/* Headline */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <PhotoIcon className="w-5 h-5" />
                Headline
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                placeholder="e.g., Software Developer at Tech Corp"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                placeholder="City, Country"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-5 h-5" />
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-200"
                placeholder="https://"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5" />
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800/70 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none transition-all duration-200"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <PhotoIcon className="w-5 h-5" />
                Profile Picture
              </label>
              <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-400 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  name="profilePicFile"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {profilePicPreview ? (
                  <>
                    <img 
                      src={profilePicPreview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('profile')}
                      className="absolute top-2 right-2 p-1.5 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-all duration-200"
                    >
                      <XMarkIcon className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <PhotoIcon className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                    <span className="text-gray-400 text-sm">Click to upload</span>
                  </div>
                )}
              </label>
            </div>

            {/* Cover Photo Upload */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <PhotoIcon className="w-5 h-5" />
                Cover Photo
              </label>
              <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-600 rounded-xl hover:border-blue-400 transition-all duration-200 cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  name="coverPhotoFile"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {coverPhotoPreview ? (
                  <>
                    <img 
                      src={coverPhotoPreview} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('cover')}
                      className="absolute top-2 right-2 p-1.5 bg-gray-900/80 hover:bg-gray-800 rounded-full transition-all duration-200"
                    >
                      <XMarkIcon className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <PhotoIcon className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                    <span className="text-gray-400 text-sm">Click to upload</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all duration-200 font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
