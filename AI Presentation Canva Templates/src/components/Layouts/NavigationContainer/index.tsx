import React from 'react';
import Header from '../../Header/Header';
import SideNavContainer from '../../SideNav/SideNavContainer';
import Footer from '../../Footer/Footer';
import './style.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  hoverIcon: string;
}

interface NavigationContainerProps {
  children: React.ReactNode;
  onMenuToggle?: () => void;
  isWebsiteView?: boolean;
  websiteButton?: React.ReactNode;
  isPrintView?: boolean;
  printButton?: React.ReactNode;
  showCanvaAI?: boolean;
  isCanvaAIView?: boolean;
  enableFooterAskCanva?: boolean; // Controls whether footer Ask Canva functionality is available
  showFooter?: boolean; // Controls footer visibility - defaults to true if not specified
  additionalNavItems?: NavItem[]; // Additional nav items for specific views (e.g., Audio, Videos for video)
}

const NavigationContainer: React.FC<NavigationContainerProps> = ({
  children,
  onMenuToggle,
  isWebsiteView,
  websiteButton,
  isPrintView,
  printButton,
  showCanvaAI,
  isCanvaAIView,
  enableFooterAskCanva = false,
  showFooter = true,
  additionalNavItems = [],
}) => {
  return (
    <>
      <Header
        onMenuToggle={onMenuToggle}
        isWebsiteView={isWebsiteView}
        websiteButton={websiteButton}
        isPrintView={isPrintView}
        printButton={printButton}
        isCanvaAIView={isCanvaAIView}
      />
      <SideNavContainer showCanvaAI={showCanvaAI} additionalNavItems={additionalNavItems} />
      {children}
      {showFooter && <Footer enableAskCanva={enableFooterAskCanva} />}
    </>
  );
};

export default NavigationContainer;
