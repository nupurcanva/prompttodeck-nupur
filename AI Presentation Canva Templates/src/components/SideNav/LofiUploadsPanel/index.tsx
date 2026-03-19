import React, { useState } from "react";
import "./style.css";

// IMAGE IMPORTS
import LofiUploadsDropdownPill from "./assets/dropdown-pill.svg?react";

// BASIC SEARCHBAR IMPORTS
import BasicSearchbar from "@components/Objects/BasicSearchbar";

interface UploadItem {
  id: number;
  type: "image" | "video" | "audio";
  name: string;
  size: "small" | "medium" | "large";
}

interface Tab {
  id: string;
  label: string;
}

const LofiUploadsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Sample data for uploaded files
  const uploads: UploadItem[] = [
    { id: 1, type: "image", name: "Image 1", size: "large" },
    { id: 2, type: "image", name: "Image 2", size: "medium" },
    { id: 3, type: "image", name: "Image 3", size: "medium" },
    { id: 4, type: "image", name: "Image 4", size: "large" },
    { id: 5, type: "image", name: "Image 5", size: "medium" },
    { id: 6, type: "image", name: "Image 6", size: "medium" },
    { id: 7, type: "image", name: "Image 7", size: "medium" },
    { id: 8, type: "image", name: "Image 8", size: "small" },
    { id: 9, type: "image", name: "Image 9", size: "small" },
    { id: 10, type: "image", name: "Image 10", size: "small" },
    { id: 11, type: "image", name: "Image 11", size: "small" },
    { id: 12, type: "image", name: "Image 12", size: "medium" },
    { id: 13, type: "image", name: "Image 13", size: "medium" },
    { id: 14, type: "image", name: "Image 14", size: "medium" },
    { id: 15, type: "image", name: "Image 15", size: "medium" },
    { id: 16, type: "image", name: "Image 16", size: "medium" },
    { id: 17, type: "image", name: "Image 17", size: "medium" },
    { id: 18, type: "image", name: "Image 18", size: "medium" },
    { id: 19, type: "image", name: "Image 19", size: "medium" },
    { id: 20, type: "image", name: "Image 20", size: "medium" },
    { id: 21, type: "image", name: "Image 21", size: "medium" },
    { id: 22, type: "image", name: "Image 22", size: "medium" },
    { id: 23, type: "image", name: "Image 23", size: "medium" },
    { id: 24, type: "image", name: "Image 24", size: "medium" },
    { id: 25, type: "image", name: "Image 25", size: "medium" },
    { id: 26, type: "image", name: "Image 26", size: "medium" },
    { id: 27, type: "image", name: "Image 27", size: "medium" },
    { id: 28, type: "image", name: "Image 28", size: "medium" },
    { id: 29, type: "image", name: "Image 29", size: "medium" },
    { id: 30, type: "image", name: "Image 30", size: "medium" },
    { id: 31, type: "image", name: "Image 31", size: "medium" },
    { id: 32, type: "image", name: "Image 32", size: "medium" },
  ];

  const tabs: Tab[] = [
    { id: "all", label: "All" },
    { id: "images", label: "Images" },
    { id: "videos", label: "Videos" },
    { id: "audio", label: "Audio" },
  ];

  return (
    <div className="lofi-uploads-panel">
      {/* Sticky Header */}
      <div className="lofi-uploads-sticky-header">
        {/* Search Bar */}
        <div className="lofi-uploads-search-container">
          <BasicSearchbar sampleText="Search uploads" />
        </div>

        {/* Upload Buttons */}
        <div className="lofi-uploads-actions">
          <button className="lofi-upload-files-btn">Upload files</button>
          <button className="lofi-upload-menu-btn">&bull;&bull;&bull;</button>
        </div>
        {/* Pill Button */}
        <div className="lofi-uploads-pill-button">
          <button className="lofi-uploads-pill-button-icon">
            <LofiUploadsDropdownPill />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="lofi-uploads-nav">
          <button className="lofi-uploads-nav-item active">
            <div className="lofi-uploads-nav-indicator"></div>
          </button>
          <button className="lofi-uploads-nav-item">
            <div className="lofi-uploads-nav-indicator"></div>
          </button>
          <button className="lofi-uploads-nav-item">
            <div className="lofi-uploads-nav-indicator"></div>
          </button>
          <button className="lofi-uploads-nav-item">
            <div className="lofi-uploads-nav-indicator"></div>
          </button>
          <button className="lofi-uploads-nav-next">
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

      {/* Uploads Grid */}
      <div className="lofi-uploads-content">
        <div className="lofi-uploads-grid">
          {uploads.map(upload => (
            <div key={upload.id} className={`lofi-upload-item ${upload.size}`}>
              <div className="lofi-upload-item-content"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LofiUploadsPanel;
