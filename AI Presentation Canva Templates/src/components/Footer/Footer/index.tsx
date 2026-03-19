import React from "react";
import FooterToolbarLeft from "@components/Footer/FooterToolbarLeft/index";
import FooterToolbarRight from "@components/Footer/FooterToolbarRight/index";
import "./style.css";

interface FooterProps {
  enableAskCanva?: boolean; // Controls whether Ask Canva functionality is available
}

const Footer: React.FC<FooterProps> = ({ enableAskCanva = false }) => {
  return (
    <div className="footer-container">
      <FooterToolbarLeft />
      <FooterToolbarRight enableAskCanva={enableAskCanva} />
    </div>
  );
};

export default Footer;
