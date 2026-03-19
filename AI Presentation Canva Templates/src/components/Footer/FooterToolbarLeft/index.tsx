import React from "react";
import "./style.css";

// IMAGE IMPORTS
import FooterButton from "@assets/icons/footer-icons/footer-toolbar-left/footer-button.svg?react";

const FooterToolbarLeft: React.FC = () => {
  return (
    <div className="footer-toolbar-left">
      <button className="footer-toolbar-button">
        <div className="footer-toolbar-icon-container">
          <FooterButton />
        </div>
      </button>

      <button className="footer-toolbar-button">
        <div className="footer-toolbar-icon-container">
          <FooterButton />
        </div>
      </button>

      <button className="footer-toolbar-button">
        <div className="footer-toolbar-icon-container">
          <FooterButton />
        </div>
      </button>
    </div>
  );
};

export default FooterToolbarLeft;
