import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SocialContext } from "../context/context";
import { XMarkIcon, PlusCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const EditSkillsModal = ({ user, onClose, onSkillsUpdated }) => {
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const { baseUrl, token } = useContext(SocialContext);

  // Append a new skill if it's not empty or already added
  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");
    }
  };

  // Remove a skill from the list
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Submit the complete skills list to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { skills };
      const { data } = await axios.patch(`${baseUrl}/user/skills`, payload, config);
      onSkillsUpdated(data.skills);
      toast.success("Skills updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Something went wrong while updating skills.");
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
            Update Skills
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700/30 rounded-full transition-all duration-300"
          >
            <XMarkIcon className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Input Section */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter new skill..."
              className="flex-1 p-3 bg-gray-800/70 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all duration-300"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-xl text-white font-medium flex items-center gap-2 transition-all duration-300"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div className="mb-6 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-4 py-2 border border-blue-400/30"
            >
              <span className="text-blue-400 text-sm">{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all duration-200 font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
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
      </div>
    </div>
  );
};

export default EditSkillsModal;

