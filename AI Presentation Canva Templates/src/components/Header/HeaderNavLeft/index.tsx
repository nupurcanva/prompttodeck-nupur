import React from "react";
import "./style.css";

import HeaderFileButton from "@components/Header/HeaderNavLeft/assets/header-file-button.svg?react";
import HeaderPillButton from "@components/Header/HeaderNavLeft/assets/header-pill.svg?react";

interface HeaderNavLeftProps {
  onMenuToggle?: () => void;
}

const HeaderNavLeft: React.FC<HeaderNavLeftProps> = ({ onMenuToggle }) => {
  return (
    <div className="header-nav-container-left">
      <nav className="header-nav-left">
        {/* Hamburger Menu */}
        <button className="header-nav-button" onClick={onMenuToggle}>
          <div className="header-nav-item">
            <HeaderFileButton className="header-nav-image" />
          </div>
        </button>

        {/* Pill Button */}
        <div className="header-pill-container">
          <button className="header-pill-button">
            <HeaderPillButton className="header-nav-image" />
          </button>
        </div>

        {/* Pill Button */}
        <div className="header-pill-container">
          <button className="header-pill-button">
            <HeaderPillButton className="header-nav-image" />
          </button>
        </div>

        {/* File Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="file-nav-item">
                <img
                  className="header-nav-image"
                  src="src/components/Header/HeaderNavLeft/assets/header-pill.svg"
                  alt="file"
                />
                <span>File</span>
                <img
                  className="header-nav-image"
                  src="@assets/icons/header-menu-icons/dropdown-arrow-icon.svg"
                  alt="dropdown"
                />
              </div>
            </div>
           </button> */}

        {/* Resize Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="resize-nav-item">
                <img
                  className="header-nav-image"
                  src="@assets/icons/header-menu-icons/pro-icon.svg"
                  alt="pro"
                />
                <span>Resize</span>
              </div>
            </div>
           </button> */}

        {/* Editing Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="editing-nav-item">
                <img
                  className="header-nav-image"
                  src="@assets/icons/header-menu-icons/edit-pencil-icon.svg"
                  alt="edit"
                />
                <span>Editing</span>
                <img
                  className="header-nav-image"
                  src="@assets/icons/header-menu-icons/dropdown-arrow-icon.svg"
                  alt="dropdown"
                />
              </div>
            </div>
           </button> */}

        {/* Divider */}
        {/* <div className="header-nav-divider" role="none"></div> */}

        {/* Undo Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
                <img
                className="header-nav-image"
                  src="@assets/icons/header-menu-icons/undo-icon.svg"
                alt="undo"
                />
            </div>
           </button> */}

        {/* Redo Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
                <img
                className="header-nav-image"
                  src="@assets/icons/header-menu-icons/redo-icon.svg"
                alt="redo"
                />
            </div>
           </button> */}

        {/* Divider */}
        {/* <div className="header-nav-divider" role="none"></div> */}

        {/* Save Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
                <img
                className="header-nav-image"
                  src="@assets/icons/header-menu-icons/save-cloud-icon.svg"
                alt="save"
                />
            </div>
           </button> */}
      </nav>
    </div>
  );
};

export default HeaderNavLeft;
