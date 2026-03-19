import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import CreateButton from './CreateButton';

// import HamburgerMenu from "./assets/hamburger-menu.svg?react";

import HamburgerMenu from './assets/hamburger-closed.svg?react';
import HamburgerMenuOpen from './assets/hamburger-open.svg?react';

// import HamburgerMenuOpen from "@assets/icons/hamburger-open.svg?react";

// import GlobalNavButton from "./assets/global-nav-button.svg?react";

import CanvaLogo from '@assets/icons/main-menu/canva-logo.svg';
import CreateDesignButton from '@assets/icons/main-menu/create-a-design-button.svg';
import ChevronDownSmall from '@assets/icons/main-menu/icon-chevron-down-small.svg';
import MenuItemVariation1 from '@assets/icons/main-menu/menu-item-variation-1.svg';
import MenuItemVariation2 from '@assets/icons/main-menu/menu-item-variation-2.svg';

import HomeIcon from './assets/home-icon.svg?react';
import HomeIconFilled from './assets/home-filled-icon.svg?react';

import TemplatesIcon from './assets/templates-icon.svg?react';
import TemplatesIconFilled from './assets/templates-filled-icon.svg?react';

import CanvaAIIcon from './assets/canva-ai-icon.svg?react';
import CanvaAIIconFilled from './assets/canva-ai-filled-icon.svg?react';

import ProjectsIcon from './assets/projects-icon.svg?react';
import ProjectsIconFilled from './assets/projects-filled-icon.svg?react';

import AppsIcon from './assets/apps-icon.svg?react';
import AppsIconFilled from './assets/apps-filled-icon.svg?react';

import BrandIcon from './assets/brand-icon.svg?react';
import BrandIconFilled from './assets/brand-filled-icon.svg?react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  iconFilled: React.ReactElement;
}

interface HomeMenuProps {
  activeItem?: string;
  onMenuItemClick?: (id: string) => void;
  onMenuToggle?: (isExpanded: boolean) => void;
  isMenuExpanded?: boolean;
}

const HomeMenu: React.FC<HomeMenuProps> = ({
  activeItem,
  onMenuItemClick = () => {},
  onMenuToggle = () => {},
  isMenuExpanded: externalMenuExpanded,
}) => {
  const navigate = useNavigate();
  // Use provided expanded state if available, otherwise manage locally
  const [localMenuExpanded, setLocalMenuExpanded] = useState(false);
  const isMenuExpanded =
    externalMenuExpanded !== undefined ? externalMenuExpanded : localMenuExpanded;

  const [expandedSections, setExpandedSections] = useState({
    starred: true,
    starredForTeam: true,
    recentDesigns: true,
  });

  // State to store randomized image selections (set once on mount)
  const [randomizedImages, setRandomizedImages] = useState<Record<string, string>>({});

  // Menu items data
  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      iconFilled: <HomeIconFilled />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <ProjectsIcon />,
      iconFilled: <ProjectsIconFilled />,
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <TemplatesIcon />,
      iconFilled: <TemplatesIconFilled />,
    },
    {
      id: 'brand',
      label: 'Brand',
      icon: <BrandIcon />,
      iconFilled: <BrandIconFilled />,
    },
    {
      id: 'Canva AI',
      label: 'Canva AI',
      icon: <CanvaAIIcon />,
      iconFilled: <CanvaAIIconFilled />,
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: <AppsIcon />,
      iconFilled: <AppsIconFilled />,
    },
  ];

  // Mock data for menu sections
  const starredItems = [
    { id: 'starred-1', title: 'Design Project 1' },
    { id: 'starred-2', title: 'Social Media Campaign' },
    { id: 'starred-3', title: 'Brand Guidelines' },
  ];

  const starredForTeamItems = [
    { id: 'team-1', title: 'Team Presentation' },
    { id: 'team-2', title: 'Marketing Assets' },
  ];

  const recentDesigns = [
    { id: 'recent-1', title: 'Instagram Post' },
    { id: 'recent-2', title: 'Facebook Cover' },
    { id: 'recent-3', title: 'Twitter Banner' },
    { id: 'recent-4', title: 'Business Card' },
    { id: 'recent-5', title: 'Website Design' },
    { id: 'recent-6', title: 'Poster Design' },
  ];

  // Handle menu item click
  const handleItemClick = (id: string) => {
    onMenuItemClick(id);
  };

  // Toggle menu expansion
  const toggleMenu = () => {
    const newState = !isMenuExpanded;

    // Only update local state if we're not controlled externally
    if (externalMenuExpanded === undefined) {
      setLocalMenuExpanded(newState);
    }

    // Notify parent component of menu state change
    onMenuToggle(newState);

    // Add/remove class from body for global styling effects
    if (newState) {
      document.body.classList.add('menu-expanded');
    } else {
      document.body.classList.remove('menu-expanded');
    }
  };

  // Toggle section expansion
  const toggleSection = (section: 'starred' | 'starredForTeam' | 'recentDesigns') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Initialize randomized images once on mount
  useEffect(() => {
    const allItems = [...starredItems, ...starredForTeamItems, ...recentDesigns];
    const imageMap: Record<string, string> = {};

    allItems.forEach(item => {
      imageMap[item.id] = Math.random() > 0.5 ? MenuItemVariation1 : MenuItemVariation2;
    });

    setRandomizedImages(imageMap);
  }, []);

  // Clean up body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-expanded');
    };
  }, []);

  return (
    <div className={`home-menu ${isMenuExpanded ? 'expanded' : ''}`}>
      <div className="menu-global">
        {/* Hamburger icon with click functionality */}
        <div className="menu-hamburger">
          <div className="menu-toggle-btn" onClick={toggleMenu}>
            <div className="hamburger-icon">
              {isMenuExpanded ? (
                <HamburgerMenuOpen style={{ maxWidth: '100%', width: '30px', height: 'auto' }} />
              ) : (
                <HamburgerMenu style={{ maxWidth: '100%', width: '30px', height: 'auto' }} />
              )}
            </div>
          </div>
        </div>

        {/* Top menu items section */}
        <div className="menu-top">
          {/* Create button */}
          <CreateButton onClick={() => navigate('/presentation?aiChatOpen=true')} />

          {/* Menu items */}
          <div className="menu-items">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="menu-icon">
                  {activeItem === item.id ? item.iconFilled : item.icon}
                </div>
                <span className="menu-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side panel that appears when expanded - styled like Canva menu */}
      <div className={`menu-local ${isMenuExpanded ? 'visible' : ''}`}>
        {/* Close menu button - visible only when expanded */}
        {/* <button className="close-menu-button" onClick={toggleMenu}>
          Close menu
        </button> */}

        <div className="menu-local-content">
          {/* Canva logo */}
          <div className="menu-local-header">
            <div className="canva-logo">
              <img src={CanvaLogo} alt="Canva" />
            </div>
          </div>

          {/* Create a design button */}
          <button
            className="create-design-button"
            onClick={() => navigate('/presentation?aiChatOpen=true')}
          >
            <img src={CreateDesignButton} alt="Create a design" />
          </button>

          {/* Starred section */}
          <div className="menu-section">
            <div className="menu-section-header" onClick={() => toggleSection('starred')}>
              <span>Starred</span>
              <img
                src={ChevronDownSmall}
                alt="Toggle"
                className={`arrow-icon ${expandedSections.starred ? 'expanded' : ''}`}
              />
            </div>
            {expandedSections.starred && (
              <div className="menu-section-items">
                {starredItems.map(item => (
                  <div key={item.id} className="menu-item-row">
                    <div className="menu-item-thumbnail"></div>
                    <img
                      src={randomizedImages[item.id] || MenuItemVariation1}
                      alt=""
                      className="menu-item-placeholder"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Starred for team section */}
          <div className="menu-section">
            <div className="menu-section-header" onClick={() => toggleSection('starredForTeam')}>
              <span>Starred for team</span>
              <img
                src={ChevronDownSmall}
                alt="Toggle"
                className={`arrow-icon ${expandedSections.starredForTeam ? 'expanded' : ''}`}
              />
            </div>
            {expandedSections.starredForTeam && (
              <div className="menu-section-items">
                {starredForTeamItems.map(item => (
                  <div key={item.id} className="menu-item-row">
                    <div className="menu-item-thumbnail"></div>
                    <img
                      src={randomizedImages[item.id] || MenuItemVariation1}
                      alt=""
                      className="menu-item-placeholder"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent designs section */}
          <div className="menu-section">
            <div className="menu-section-header" onClick={() => toggleSection('recentDesigns')}>
              <span>Recent designs</span>
              <img
                src={ChevronDownSmall}
                alt="Toggle"
                className={`arrow-icon ${expandedSections.recentDesigns ? 'expanded' : ''}`}
              />
            </div>
            {expandedSections.recentDesigns && (
              <div className="menu-section-items">
                {recentDesigns.map(item => (
                  <div key={item.id} className="menu-item-row">
                    <div className="menu-item-thumbnail"></div>
                    <img
                      src={randomizedImages[item.id] || MenuItemVariation1}
                      alt=""
                      className="menu-item-placeholder"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMenu;
