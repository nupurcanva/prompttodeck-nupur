import React from "react";
import "./style.css";

// IMAGE IMPORTS
import HeaderShareButton from "@components/Header/HeaderNavRight/assets/header-share-button.svg?react";
// import HeaderPeopleButton from "@components/Header/HeaderNavRight/assets/CT_Team.jpg";
import HeaderPeopleButton from "@components/Header/HeaderNavRight/assets/CT_Team.svg?react";
import AvaIcon from "@components/Header/HeaderNavRight/assets/Ava.svg?react";
import MarcioIcon from "@components/Header/HeaderNavRight/assets/Marcio.svg?react";

interface HeaderNavRightProps {
  isWebsiteView?: boolean;
  websiteButton?: React.ReactNode;
  isPrintView?: boolean;
  printButton?: React.ReactNode;
  isCanvaAIView?: boolean;
}

const HeaderNavRight: React.FC<HeaderNavRightProps> = ({
  isWebsiteView = false,
  websiteButton,
  isPrintView = false,
  printButton,
  isCanvaAIView = false,
}) => {
  return (
    <div className="header-nav-container-right">
      <nav className="header-nav-right">
        {/* People Add Button */}
        {/* <div className="collaboration-div">
            <div className="collaboration-div-item">
              <div className="header-nav-button">
                <div className="header-nav-item">
                  <div className="border-nav-button add-people-nav-item">
                    <img
                      className="header-nav-image add-people-icon-image"
                      src="@assets/icons/header-menu-icons/add-people-icon.svg"
                      alt="filter-icon"
                    />
                    <span>Add people</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

        {/* Magic Edit Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="border-nav-button magic-edit-nav-item">
                <img
                  className="header-nav-image magic-edit-icon-image"
                  src="@assets/icons/header-menu-icons/magic-edit-icon.svg"
                  alt="filter-icon"
                />
                <span>Magic Edit</span>
              </div>
            </div>
           </button> */}

        {/* Filter Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="border-nav-button filter-nav-item">
                <img
                  className="header-nav-image filter-icon-image"
                  src="@assets/icons/header-menu-icons/filter-icon.svg"
                  alt="filter-icon"
                />
                <span>Filter</span>
              </div>
            </div>
           </button> */}

        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="border-nav-button comment-nav-item">
                <img
                  className="header-nav-image comment-icon-image"
                  src="@assets/icons/header-menu-icons/comment-icon.svg"
                  alt="filter-icon"
                />
              </div>
            </div>
           </button> */}

        {/* Present Button */}
        {/* <button className="header-nav-button">
            <div className="header-nav-item">
              <div className="border-nav-button present-nav-item">
                <img
                  className="header-nav-image editing-icon-image"
                  src="@assets/icons/header-menu-icons/present-icon.svg"
                  alt="filter-icon"
                />
                <span>Present</span>
              </div>
            </div>
           </button> */}

        <div className="header-people-container">
          <button className="header-people-button">
            <AvaIcon className="header-nav-image" />
          </button>

          {/* Show MarcioIcon only in Canva AI view */}
          {isCanvaAIView && (
            <button className="header-people-button">
              <MarcioIcon className="header-nav-image" />
            </button>
          )}
        </div>

        {/* Website Publish Button - conditionally rendered */}
        {isWebsiteView && websiteButton && (
          <div className="header-website-publish-container">{websiteButton}</div>
        )}

        {/* Print with Canva Button - conditionally rendered between Present and Share */}
        {isPrintView && printButton && (
          <div className="header-print-with-canva-container">{printButton}</div>
        )}

        <div className="header-share-container">
          <button className="header-share-button">
            <HeaderShareButton className="header-nav-image" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HeaderNavRight;
