import React from "react";
import "./style.css";

// IMAGE IMPORTS

import LofiProjectsPanelDownloadFolder from "./assets/download-folder.svg?react";
import LofiProjectsPanelCreateFolder from "./assets/create-folder.svg?react";
import LofiProjectsPanelEmptyFolder from "./assets/empty-folder.svg?react";
import LofiProjectsPanelStaredFolder from "./assets/stared-folder.svg?react";
import LofiProjectsPanelProjectsDropdown from "./assets/projects-dropdown.svg?react";

// BASIC SEARCHBAR IMPORTS
import BasicSearchbar from "@components/Objects/BasicSearchbar";

// Define TypeScript interfaces for our data
interface Design {
  id: number;
  name: string;
  type: string;
}

interface Folder {
  id: number;
  name: string;
  count: number | null;
  icon: "plus" | "download" | "star" | "folder";
}

interface Image {
  id: number;
  size: "large" | "small";
}

const LofiProjectsPanel: React.FC = () => {
  // Sample data for designs
  const designs: Design[] = [
    { id: 1, name: "Love Wins", type: "Instagram post" },
    { id: 2, name: "Beauty Skin Care", type: "Instagram Story" },
    { id: 3, name: "Vision Deck", type: "Presentation" },
    { id: 4, name: "Be Kind", type: "Facebook Post" },
  ];

  // Sample data for folders
  const folders: Folder[] = [
    { id: 1, name: "Create folder", count: null, icon: "plus" },
    { id: 2, name: "Purchased", count: 5, icon: "download" },
    { id: 3, name: "Starred", count: 5, icon: "star" },
    { id: 4, name: "Mountain package", count: 0, icon: "folder" },
  ];

  // Sample data for images
  const images: Image[] = [
    { id: 1, size: "large" },
    { id: 2, size: "small" },
    { id: 3, size: "small" },
    { id: 4, size: "small" },
    { id: 5, size: "large" },
    { id: 6, size: "small" },
  ];

  return (
    <div className="lofi-projects-panel">
      {/* Sticky Header Section */}
      <div className="lofi-projects-sticky-header">
        {/* Search Bar */}
        <div className="lofi-projects-search-container">
          <BasicSearchbar sampleText="Search your content" />
        </div>

        {/* Dropdown Menu */}
        <div className="lofi-projects-dropdown">
          <LofiProjectsPanelProjectsDropdown />

          {/* <button className="lofi-projects-dropdown-btn">
              <span>All your content</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
             </button> */}
        </div>

        {/* Navigation Tabs */}
        <div className="lofi-projects-nav">
          <button className="lofi-projects-nav-item active">
            <div className="lofi-projects-nav-indicator"></div>
          </button>
          <button className="lofi-projects-nav-item">
            <div className="lofi-projects-nav-indicator"></div>
          </button>
          <button className="lofi-projects-nav-item">
            <div className="lofi-projects-nav-indicator"></div>
          </button>
          <button className="lofi-projects-nav-item">
            <div className="lofi-projects-nav-indicator"></div>
          </button>
          <button className="lofi-projects-nav-next">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="lofi-projects-scrollable-content">
        {/* Designs Section */}
        <div className="lofi-projects-section">
          <div className="lofi-projects-section-header">
            <h3>Designs</h3>
            <a href="#" className="lofi-projects-see-all">
              See all
            </a>
          </div>

          <div className="scrollable-container">
            <div className="horizontal-scroll">
              {designs.map(design => (
                <div key={design.id} className="lofi-projects-design-item scroll-item">
                  <div className="lofi-projects-design-preview"></div>
                  <div className="lofi-projects-design-info">
                    <h4>{design.name}</h4>
                    <p>{design.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Folders Section */}
        <div className="lofi-projects-section">
          <div className="lofi-projects-section-header">
            <h3>Folders</h3>
            <a href="#" className="lofi-projects-see-all">
              See all
            </a>
          </div>

          <div className="lofi-projects-folders-list">
            {folders.map(folder => (
              <div key={folder.id} className="lofi-projects-folder-item">
                <div className="lofi-projects-folder-icon">
                  {folder.icon === "plus" && <LofiProjectsPanelCreateFolder />}
                  {folder.icon === "download" && <LofiProjectsPanelDownloadFolder />}
                  {folder.icon === "star" && <LofiProjectsPanelStaredFolder />}
                  {folder.icon === "folder" && <LofiProjectsPanelEmptyFolder />}
                </div>
                <div className="lofi-projects-folder-info">
                  <h4>{folder.name}</h4>
                  {folder.count !== null && <p>{folder.count} items</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images Section */}
        <div className="lofi-projects-section">
          <div className="lofi-projects-section-header">
            <h3>Images</h3>
            <a href="#" className="lofi-projects-see-all">
              See all
            </a>
          </div>

          <div className="scrollable-container">
            <div className="horizontal-scroll">
              {images.map(image => (
                <div
                  key={image.id}
                  className={`lofi-projects-image-item ${image.size} scroll-item`}
                >
                  <div className="lofi-projects-image-preview"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LofiProjectsPanel;
