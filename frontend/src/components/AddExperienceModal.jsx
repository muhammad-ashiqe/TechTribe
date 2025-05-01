import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SocialContext } from "../context/context";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const AddExperienceModal = ({ user, onClose, onExperienceAdded, experienceToEdit }) => {
  const [formData, setFormData] = useState({
    title: experienceToEdit?.title || "",
    company: experienceToEdit?.company || "",
    period: experienceToEdit?.period || "",
    description: experienceToEdit?.description || "",
  });

  const {baseUrl,token} = useContext(SocialContext)
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (experienceToEdit) {
        // Update existing experience
        const { data } = await axios.put(
          `${baseUrl}/user/experiences/${experienceToEdit._id}`,
          formData,
          config
        );
        toast.success("Experience updated successfully!");
        onExperienceAdded(data.experiences);
      } else {
        // Add new experience
        const { data } = await axios.post(
          `${baseUrl}/user/experience`,
          formData,
          config
        );
        toast.success("Experience added successfully!");
        onExperienceAdded(data.experiences);
      }
      onClose();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(error.response?.data?.message || "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {experienceToEdit ? "Edit Experience" : "Add Experience"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700/30 rounded-full transition-all duration-300"
          >
            <XMarkIcon className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company*
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period*
              </label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleChange}
                placeholder="e.g. Jan 2020 - Present"
                required
                className="w-full p-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all duration-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-medium transition-all duration-300 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExperienceModal;