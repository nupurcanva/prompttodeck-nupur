import React, { useState } from "react";
import "./style.css";

// IMAGE IMPORTS
import LofiAppsPanelPartyApp from "./assets/party-app.svg?react";
import LofiAppsPanelTeamApp from "./assets/team-app.svg?react";

// BASIC SEARCHBAR IMPORTS
import BasicSearchbar from "@components/Objects/BasicSearchbar";

// Define TypeScript interfaces for our data
interface App {
  id: number;
  name: string;
}

const LofiAppsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("discover");

  // Sample data for apps
  const featuredApps: App[] = [
    { id: 1, name: "Featured App 1" },
    { id: 2, name: "Featured App 2" },
    { id: 3, name: "Featured App 3" },
    { id: 4, name: "Featured App 4" },
  ];

  const trendingApps: App[] = [
    { id: 1, name: "Trending App 1" },
    { id: 2, name: "Trending App 2" },
    { id: 3, name: "Trending App 3" },
    { id: 4, name: "Trending App 4" },
  ];

  const moreFromCanva: App[] = [
    { id: 1, name: "Canva App 1" },
    { id: 2, name: "Canva App 2" },
    { id: 3, name: "Canva App 3" },
    { id: 4, name: "Canva App 4" },
    { id: 5, name: "Canva App 5" },
    { id: 6, name: "Canva App 6" },
  ];

  const teamApps: App[] = [
    { id: 1, name: "Team App 1" },
    { id: 2, name: "Team App 2" },
    { id: 3, name: "Team App 3" },
    { id: 4, name: "Team App 4" },
    { id: 5, name: "Team App 5" },
    { id: 6, name: "Team App 6" },
    { id: 7, name: "Team App 7" },
    { id: 8, name: "Team App 8" },
    { id: 9, name: "Team App 9" },
    { id: 10, name: "Team App 10" },
    { id: 11, name: "Team App 11" },
    { id: 12, name: "Team App 12" },
    { id: 13, name: "Team App 13" },
    { id: 14, name: "Team App 14" },
    { id: 15, name: "Team App 15" },
    { id: 16, name: "Team App 16" },
  ];

  return (
    <div className="lofi-apps-panel">
      {/* Dropdown component */}
      {/* Sticky Header Section */}
      <div className="lofi-apps-sticky-header">
        {/* Search Bar */}
        <div className="lofi-apps-search-container">
          <BasicSearchbar sampleText="Search Canva apps" />
        </div>

        {/* Tabs */}
        <div className="lofi-apps-tabs">
          <button
            className={`lofi-apps-tab ${activeTab === "discover" ? "active" : ""}`}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>
          <button
            className={`lofi-apps-tab ${activeTab === "your-apps" ? "active" : ""}`}
            onClick={() => setActiveTab("your-apps")}
          >
            Your apps
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="lofi-apps-scrollable-content">
        {/* Only show discover tab content for simplicity */}
        {activeTab === "discover" && (
          <div className="lofi-apps-content">
            {/* Featured Section */}
            <div className="lofi-apps-section">
              <div className="lofi-apps-section-header">
                <h3>Featured</h3>
              </div>
              <div className="scrollable-container">
                <div className="horizontal-scroll">
                  {featuredApps.map(app => (
                    <div key={app.id} className="lofi-app-item scroll-item">
                      <div className="lofi-app-item-content">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 76 76"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="lofi-app-item-svg"
                        >
                          <rect x="0" y="0" width="76" height="76" rx="8" fill="#E8EAED" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Section */}
            <div className="lofi-apps-section">
              <div className="lofi-apps-section-header">
                <h3>Trending</h3>
              </div>
              <div className="scrollable-container">
                <div className="horizontal-scroll">
                  {trendingApps.map(app => (
                    <div key={app.id} className="lofi-app-item scroll-item">
                      <div className="lofi-app-item-content">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 76 76"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="lofi-app-item-svg"
                        >
                          <rect x="0" y="0" width="76" height="76" rx="8" fill="#E8EAED" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* More from Canva Section */}
            <div className="lofi-apps-section">
              <div className="lofi-apps-section-header">
                <h3>More from Canva</h3>
                <a href="#" className="lofi-apps-see-all">
                  See all
                </a>
              </div>
              <div className="lofi-apps-grid more-canva-grid">
                {moreFromCanva.map(app => (
                  <div key={app.id} className="lofi-app-item small canva-app">
                    <div className="lofi-app-item-content">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 104 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="lofi-app-item-svg"
                      >
                        <rect
                          x="0.5"
                          y="0.5"
                          width="103"
                          height="71"
                          rx="7.5"
                          stroke="#394C60"
                          strokeOpacity="0.15"
                        />

                        <g clipPath="url(#clip0_785_50365)">
                          <rect x="36" y="12" width="32" height="32" rx="8" fill="#EBEDEF" />

                          <g style={{ mixBlendMode: "color-burn" }}>
                            <rect
                              x="36"
                              y="12"
                              width="32"
                              height="32"
                              fill="url(#paint0_radial_785_50365)"
                              fillOpacity="0.75"
                            />
                          </g>
                        </g>
                        <rect
                          x="29.5"
                          y="52"
                          width="45"
                          height="8"
                          rx="4"
                          fill="#394C60"
                          fillOpacity="0.15"
                        />

                        <defs>
                          <radialGradient
                            id="paint0_radial_785_50365"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(45.2 19.2) rotate(54.8658) scale(39.6182)"
                          >
                            <stop stopColor="white" />
                            <stop offset="1" />
                          </radialGradient>
                          <clipPath id="clip0_785_50365">
                            <rect x="36" y="12" width="32" height="32" rx="8" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Apps for your team Section */}
            <div className="lofi-apps-section">
              <div className="lofi-apps-section-header">
                <h3>Apps for your team</h3>
                <a href="#" className="lofi-apps-see-all">
                  See all
                </a>
              </div>
              <div className="lofi-apps-grid team-apps-grid">
                {teamApps.map(app => (
                  <div key={app.id} className="lofi-app-item small">
                    <div className="lofi-app-item-content">
                      <LofiAppsPanelTeamApp className="lofi-app-item-svg" />

                      {/* <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 76 76"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lofi-app-item-svg"
                    >
                    <g clipPath="url(#clip0_786_37721)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0H76V76H0V0Z"
                      fill="#40576D"
                      fillOpacity="0.07"
                    />
                    </g>
                    <defs>
                    <clipPath id="clip0_786_37721">
                      <path
                        d="M0 8C0 3.58172 3.58172 0 8 0H68C72.4183 0 76 3.58172 76 8V68C76 72.4183 72.4183 76 68 76H8C3.58172 76 0 72.4183 0 68V8Z"
                        fill="white"
                      />
                    </clipPath>
                    </defs>
                    </svg> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Your apps tab would go here */}
        {activeTab === "your-apps" && (
          <div className="lofi-apps-content">
            <div className="lofi-apps-empty-state">
              <p>No apps installed yet</p>
              <button className="lofi-apps-browse-button">Browse Canva Apps</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LofiAppsPanel;
