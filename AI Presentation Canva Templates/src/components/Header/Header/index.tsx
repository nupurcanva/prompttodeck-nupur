import React from "react";
import HeaderNavLeft from "../HeaderNavLeft";
import HeaderNavRight from "../HeaderNavRight";
import "./style.css";

interface HeaderProps {
  onMenuToggle?: () => void;
  isWebsiteView?: boolean;
  websiteButton?: React.ReactNode;
  isPrintView?: boolean;
  printButton?: React.ReactNode;
  isCanvaAIView?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isWebsiteView = false,
  websiteButton,
  isPrintView = false,
  printButton,
  isCanvaAIView = false,
}) => {
  return (
    <div className="header-container">
      <div className="header-nav-container-group">
        <HeaderNavLeft onMenuToggle={onMenuToggle} />
        <HeaderNavRight
          isWebsiteView={isWebsiteView}
          websiteButton={websiteButton}
          isPrintView={isPrintView}
          printButton={printButton}
          isCanvaAIView={isCanvaAIView}
        />
      </div>
    </div>
  );
};

export default Header;
