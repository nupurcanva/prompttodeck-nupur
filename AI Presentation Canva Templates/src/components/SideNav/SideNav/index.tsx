import React from 'react';
import './style.css';

import DesignIcon from '@assets/icons/side-menu-icons/design-icon.svg';
import HoverDesignIcon from '@assets/icons/side-menu-icons/hover-design-icon.svg';
import ElementsIcon from '@assets/icons/side-menu-icons/elements-icon.svg';
import HoverElementsIcon from '@assets/icons/side-menu-icons/hover-elements-icon.svg';
import TextIcon from '@assets/icons/side-menu-icons/text-icon.svg';
import HoverTextIcon from '@assets/icons/side-menu-icons/hover-text-icon.svg';
import BrandIcon from '@assets/icons/side-menu-icons/brand-icon.svg';
import HoverBrandIcon from '@assets/icons/side-menu-icons/hover-brand-icon.svg';
import UploadsIcon from '@assets/icons/side-menu-icons/uploads-icon.svg';
import HoverUploadsIcon from '@assets/icons/side-menu-icons/hover-uploads-icon.svg';
import ToolsIcon from '@assets/icons/side-menu-icons/tools-icon.svg';
import HoverToolsIcon from '@assets/icons/side-menu-icons/hover-tools-icon.svg';
import ProjectsIcon from '@assets/icons/side-menu-icons/projects-icon.svg';
import HoverProjectsIcon from '@assets/icons/side-menu-icons/hover-projects-icon.svg';
import AppsIcon from '@assets/icons/side-menu-icons/apps-icon.svg';
import HoverAppsIcon from '@assets/icons/side-menu-icons/hover-apps-icon.svg';
import MagicMediaIcon from '@assets/icons/side-menu-icons/magic-media-icon.svg';
import HoverMagicMediaIcon from '@assets/icons/side-menu-icons/hover-magic-media-icon.svg';
import ChartsIcon from '@assets/icons/side-menu-icons/charts-icon.svg';
import HoverChartsIcon from '@assets/icons/side-menu-icons/hover-charts-icon.svg';
import CanvaAIIcon from '@assets/icons/side-menu-icons/canva-ai-icon.svg';
import HoverCanvaAIIcon from '@assets/icons/side-menu-icons/hover-canva-ai-icon.svg';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  hoverIcon: string;
}

interface SideNavProps {
  activeId: string | null;
  onNavButtonClick: (id: string) => void;
  showCanvaAI?: boolean;
  additionalNavItems?: NavItem[]; // Additional items for specific views (e.g., Audio, Videos for video view)
}

const SideNav: React.FC<SideNavProps> = ({
  activeId,
  onNavButtonClick,
  showCanvaAI = false,
  additionalNavItems = [],
}) => {
  const baseNavItems: NavItem[] = [
    {
      id: 'design',
      label: 'Design',
      icon: DesignIcon,
      hoverIcon: HoverDesignIcon,
    },
    {
      id: 'elements',
      label: 'Elements',
      icon: ElementsIcon,
      hoverIcon: HoverElementsIcon,
    },
    {
      id: 'text',
      label: 'Text',
      icon: TextIcon,
      hoverIcon: HoverTextIcon,
    },
    {
      id: 'brand',
      label: 'Brand',
      icon: BrandIcon,
      hoverIcon: HoverBrandIcon,
    },
    {
      id: 'uploads',
      label: 'Uploads',
      icon: UploadsIcon,
      hoverIcon: HoverUploadsIcon,
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: ToolsIcon,
      hoverIcon: HoverToolsIcon,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: ProjectsIcon,
      hoverIcon: HoverProjectsIcon,
    },
    {
      id: 'apps',
      label: 'Apps',
      icon: AppsIcon,
      hoverIcon: HoverAppsIcon,
    },
    {
      id: 'magic-media',
      label: 'Magic Media',
      icon: MagicMediaIcon,
      hoverIcon: HoverMagicMediaIcon,
    },
    // Insert additional items here (after magic-media)
    ...additionalNavItems,
    {
      id: 'charts',
      label: 'Charts',
      icon: ChartsIcon,
      hoverIcon: HoverChartsIcon,
    },
  ];

  const canvaAIItem: NavItem = {
    id: 'canva-ai',
    label: 'Canva design agent',
    icon: CanvaAIIcon,
    hoverIcon: HoverCanvaAIIcon,
  };

  const navItems = showCanvaAI ? [canvaAIItem, ...baseNavItems] : baseNavItems;

  return (
    <div className={`side-container ${activeId === 'canva-ai' ? 'menu-expanded' : ''}`}>
      {navItems.map(item => (
        <button
          key={item.id}
          data-id={item.id}
          className={`side-nav-button ${activeId === item.id ? 'active' : ''} ${
            activeId === 'canva-ai' ? 'menu-expanded' : ''
          }`}
          onClick={() => onNavButtonClick(item.id)}
        >
          <div className="side-nav-icon">
            <img src={item.icon} alt={item.label} className="default-icon" />
            <img src={item.hoverIcon} alt={item.label} className="hover-icon" />
          </div>
          <div className="side-nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default SideNav;
