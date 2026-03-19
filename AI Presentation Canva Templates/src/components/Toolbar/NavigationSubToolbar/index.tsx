import React from "react";
import "./style.css";

import CreateComponentIcon from "./assets/create-component.svg?react";
import CommentIcon from "./assets/comment-icon.svg?react";
import DeleteIcon from "./assets/delete-icon.svg?react";
import MoreOptionsIcon from "./assets/more-options-icon.svg?react";

interface NavigationSubToolbarProps {
  isVisible: boolean;
  onClearSelection?: () => void;
}

const NavigationSubToolbar: React.FC<NavigationSubToolbarProps> = ({
  isVisible,
  onClearSelection,
}) => {
  const handleCommentClick = () => {
    // Comment functionality placeholder
  };

  const handleDeleteClick = () => {
    // Remove navigation from all pages

    // First, clear the navigation menu selection immediately using the callback
    if (onClearSelection) {
      onClearSelection();
    }

    // Add a small delay to ensure state is updated before firing the removal event
    setTimeout(() => {
      const removeNavEvent = new CustomEvent("navigation-menu-remove-all");
      window.dispatchEvent(removeNavEvent);
    }, 10); // 10ms delay to ensure state update
  };

  const handleMoreOptionsClick = () => {
    // More options functionality placeholder
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="navigation-sub-toolbar sub-toolbar">
      <div className="sub-toolbar-content">
        {/* <button
          className="sub-toolbar-button create-component-button"
          onClick={handleCommentClick}
          title="Create Component"
        >
          <CreateComponentIcon className="create-component-icon" />
        </button> */}

        <button className="sub-toolbar-button" onClick={handleCommentClick} title="Comment">
          <CommentIcon className="comment-icon" />
        </button>

        <button className="sub-toolbar-button" onClick={handleDeleteClick} title="Delete">
          <DeleteIcon className="delete-icon" />
        </button>

        <button
          className="sub-toolbar-button"
          onClick={handleMoreOptionsClick}
          title="More Options"
        >
          <MoreOptionsIcon className="more-options-icon" />
        </button>
      </div>
    </div>
  );
};

export default NavigationSubToolbar;
