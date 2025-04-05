import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddExperienceModal = ({ user, onClose, onExperienceAdded, experienceToEdit }) => {
  const [formData, setFormData] = useState({
    title: experienceToEdit?.title || "",
    company: experienceToEdit?.company || "",
    period: experienceToEdit?.period || "",
    description: experienceToEdit?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (experienceToEdit) {
        // Update existing experience
        const { data } = await axios.put(
          `http://localhost:7000/api/user/experiences/${experienceToEdit._id}`,
          formData,
          config
        );
        toast.success("Experience updated successfully!");
        onExperienceAdded(data.experiences);
      } else {
        // Add new experience
        const { data } = await axios.post(
          "http://localhost:7000/api/user/experience",
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {experienceToEdit ? "Edit Experience" : "Add Experience"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company*
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Period*
              </label>
              <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleChange}
                placeholder="e.g. Jan 2020 - Present"
                required
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExperienceModal;