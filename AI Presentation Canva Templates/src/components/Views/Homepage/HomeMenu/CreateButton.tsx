import React from "react";
import "./CreateButton.css";

interface CreateButtonProps {
  onClick: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      aria-label="Create a design"
      className="create-button-circular"
      onClick={onClick}
    >
      <span className="create-button-icon-wrapper">
        <span aria-hidden="true" className="create-button-icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="create-button-svg"
          >
            <path
              fill="currentColor"
              d="M12.75 11.25V5a.75.75 0 1 0-1.5 0v6.25H5a.75.75 0 1 0 0 1.5h6.25V19a.75.75 0 1 0 1.5 0v-6.25H19a.75.75 0 1 0 0-1.5h-6.25z"
            />
          </svg>
        </span>
      </span>
    </button>
  );
};

export default CreateButton;
