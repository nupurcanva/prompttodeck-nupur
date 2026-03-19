import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";

import FooterPill from "@assets/icons/footer-icons/footer-toolbar-right/footer-pill.svg?react";
import FooterZoom from "@assets/icons/footer-icons/footer-toolbar-right/footer-zoom.svg?react";
import FooterSquareButton from "@assets/icons/footer-icons/footer-toolbar-right/footer-square-button.svg?react";
import FooterAskCanva from "./assets/askCanva-editor.svg?react";

import AskCanvaChat from "@components/Views/AskCanva/AskCanvaChat";

interface FooterToolbarRightProps {
  enableAskCanva?: boolean; // Controls whether Ask Canva functionality is available
}

const FooterToolbarRight: React.FC<FooterToolbarRightProps> = ({ enableAskCanva = false }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  // Detect current editor view from URL
  const detectCurrentView = () => {
    const path = location.pathname;
    if (path.includes("/presentation")) return "presentation";
    if (path.includes("/docs")) return "docs";
    if (path.includes("/sheets")) return "sheets";
    if (path.includes("/whiteboard")) return "whiteboard";
    if (path.includes("/website")) return "website";
    return "editor"; // fallback
  };

  const handleAskCanvaClick = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Create context for the chat based on current editor view
  const chatContext = {
    currentView: detectCurrentView(),
    userActivity: "editing",
    currentContent: {
      type: detectCurrentView(),
      isEditing: true,
      hasContent: true,
    },
    pageData: {
      view: detectCurrentView(),
      hasFooterAskCanva: true,
      path: location.pathname,
    },
  };

  return (
    <>
      <div className="footer-toolbar-right">
        <div className="footer-toolbar-zoom-container">
          <button className="right-footer-toolbar-button">
            <div className="right-footer-toolbar-icon-container pill">
              <FooterPill />
            </div>
          </button>

          <div className="zoom-container">
            <FooterZoom />
          </div>

          <button className="right-footer-toolbar-button">
            <div className="right-footer-toolbar-icon-container pill">
              <FooterPill />
            </div>
          </button>
        </div>

        <button className="right-footer-toolbar-button">
          <div className="right-footer-toolbar-icon-container">
            <FooterSquareButton />
          </div>
        </button>

        <button className="right-footer-toolbar-button">
          <div className="right-footer-toolbar-icon-container">
            <FooterSquareButton />
          </div>
        </button>

        {enableAskCanva && (
          <button className="right-footer-toolbar-button" onClick={handleAskCanvaClick}>
            <div className="right-footer-toolbar-icon-container">
              <FooterAskCanva />
            </div>
          </button>
        )}
      </div>

      {/* AskCanva Chat - Only available when enabled */}
      {enableAskCanva && <AskCanvaChat isVisible={isChatOpen} onClose={handleCloseChat} />}
    </>
  );
};

export default FooterToolbarRight;
