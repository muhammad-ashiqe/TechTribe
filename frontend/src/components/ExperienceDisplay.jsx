import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AddExperienceModal from "./AddExperienceModal";
import { SocialContext } from "../context/context";

const ExperienceDisplay = ({ experiences, onExperienceDeleted, editable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState(null);
  const {baseUrl,token} = useContext(SocialContext)

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
    toast.success("Experience updated successfully");
  };

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div
          key={exp._id}
          className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{exp.title}</h3>
              <p className="text-blue-400">{exp.company}</p>
              <p className="text-gray-400 text-sm">{exp.period}</p>
              {exp.description && (
                <p className="mt-2 text-gray-300">{exp.description}</p>
              )}
            </div>
            {editable && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setExperienceToEdit(exp);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
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
          onExperienceAdded={handleExperienceUpdated} // Updated this line
          experienceToEdit={experienceToEdit}
        />
      )}
    </div>
  );
};

export default ExperienceDisplay;