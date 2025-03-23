import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditSkillsModal = ({ user, onClose, onSkillsUpdated }) => {
  // Start with the user's existing skills (or an empty array)
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

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
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { skills };
      const { data } = await axios.patch("http://localhost:7000/api/user/skills", payload, config);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">Update Skills</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a skill"
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            Add Skill
          </button>
        </div>
        <div className="mb-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-blue-600 text-white rounded-full px-3 py-1 mr-2 mb-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 text-red-300 hover:text-red-500"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSkillsModal;
