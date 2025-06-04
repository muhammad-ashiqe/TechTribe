import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddExperienceModal from "./AddExperienceModal";
import { SocialContext } from "../context/context";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const ExperienceDisplay = ({ experiences, onExperienceDeleted, editable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState(null);
  const { baseUrl, token } = useContext(SocialContext);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/user/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onExperienceDeleted(id);
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Failed to delete experience");
    }
  };

  // New function to handle experience updates
  const handleExperienceUpdated = (updatedExperiences) => {
    // This will trigger a re-render in the parent component
    onExperienceDeleted(null); // Using the same prop but with null to indicate update
    setIsModalOpen(false);
    setExperienceToEdit(null);
    // toast.success("Experience updated successfully");
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div
          key={exp._id}
          className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:border-blue-500/30 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {exp.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">{exp.company}</span>
                <span className="text-gray-500">•</span>
                <span className="text-sm bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {exp.period}
                </span>
              </div>
              {exp.description && (
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
            {editable && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setExperienceToEdit(exp);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 hover:bg-gray-700/30 rounded-full transition-all duration-300"
                >
                  <PencilIcon className="w-5 h-5 text-blue-400 hover:text-blue-300" />
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="p-1.5 hover:bg-gray-700/30 rounded-full transition-all duration-300"
                >
                  <TrashIcon className="w-5 h-5 text-red-400 hover:text-red-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {isModalOpen && (
        <AddExperienceModal
          user={{ experiences }}
          onClose={() => {
            setIsModalOpen(false);
            setExperienceToEdit(null);
          }}
          onExperienceAdded={handleExperienceUpdated}
          experienceToEdit={experienceToEdit}
        />
      )}
    </div>
  );
};

export default ExperienceDisplay;