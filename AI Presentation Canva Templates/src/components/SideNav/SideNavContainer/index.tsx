import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import LofiDesignPanel from '../LofiDesignPanel';
import LofiElementsPanel from '../LofiElementsPanel';
import LofiTextPanel from '../LofiTextPanel';
import LofiBrandPanel from '../LofiBrandPanel';
import LofiUploadsPanel from '../LofiUploadsPanel';
import LofiToolsPanel from '../LofiToolsPanel';
import LofiProjectsPanel from '../LofiProjectsPanel';
import LofiAppsPanel from '../LofiAppsPanel';
import AudioPanel from '../AudioPanel';
import VideoPanel from '../VideoPanel';
import EditSidebarPanel from '../EditSidebarPanel';
import ColourSidebarPanel from '../ColourSidebarPanel';
import { useNavMenuStyleStore } from '../../../stores/navMenuStyle';
import './style.css';
import CanvaAIPanel from '../CanvaAIPanel';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  hoverIcon: string;
}

interface SideNavContainerProps {
  showCanvaAI?: boolean;
  additionalNavItems?: NavItem[]; // Additional nav items for specific views
}

const SideNavContainer: React.FC<SideNavContainerProps> = ({
  showCanvaAI = false,
  additionalNavItems = [],
}) => {
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [isToolsPopoutVisible, setIsToolsPopoutVisible] = useState<boolean>(false);
  const [toolsPopoutPosition, setToolsPopoutPosition] = useState({
    top: 0,
    left: 84,
  });

  // Get edit panel and colour panel state from navigation store
  const { isEditPanelInSidebar, isColourPanelInSidebar } = useNavMenuStyleStore();

  // Update body class when panels change
  useEffect(() => {
    const hasSidePanel =
      activePanelId !== null ||
      isToolsPopoutVisible ||
      isEditPanelInSidebar ||
      isColourPanelInSidebar;

    if (hasSidePanel) {
      document.body.classList.add('has-side-panel-open');
    } else {
      document.body.classList.remove('has-side-panel-open');
    }

    return () => {
      document.body.classList.remove('has-side-panel-open');
    };
  }, [activePanelId, isToolsPopoutVisible, isEditPanelInSidebar, isColourPanelInSidebar]);

  // Listen for custom event to close all side panels
  useEffect(() => {
    const handleCloseSidePanels = () => {
      setActivePanelId(null);
      setIsToolsPopoutVisible(false);
    };

    window.addEventListener('closeSidePanels', handleCloseSidePanels);

    return () => {
      window.removeEventListener('closeSidePanels', handleCloseSidePanels);
    };
  }, []);

  // Listen for custom event to open the Audio panel
  useEffect(() => {
    const handleOpenAudioPanel = () => {
      setActivePanelId('audio');
      setIsToolsPopoutVisible(false);
    };

    window.addEventListener('openAudioPanel', handleOpenAudioPanel);

    return () => {
      window.removeEventListener('openAudioPanel', handleOpenAudioPanel);
    };
  }, []);

  // Auto-open Canva AI panel when landing from ChatGPT
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'chatgpt') {
      setActivePanelId('canva-ai');
      setIsToolsPopoutVisible(false);
    }
  }, []);

  const handleNavButtonClick = (id: string): void => {
    // Special handling for Tools panel
    if (id === 'tools') {
      // Position exactly halfway down the screen
      const screenHeight = window.innerHeight;
      const panelHeight = 480; // Estimated panel height - increased to match UI

      const toolsButton = document.querySelector('[data-id="tools"]');
      if (toolsButton) {
        const rect = toolsButton.getBoundingClientRect();
        setToolsPopoutPosition({
          top: Math.max(10, screenHeight / 2 - panelHeight / 2), // Center vertically with min padding
          left: rect.right + 10, // Position to the right of sidebar
        });
      }

      // Toggle tools popout visibility
      setIsToolsPopoutVisible(!isToolsPopoutVisible);

      // Keep the tools button active when popout is visible
      setActivePanelId(isToolsPopoutVisible ? null : 'tools');
    } else {
      // For other panels, toggle them normally
      setActivePanelId(id === activePanelId ? null : id);

      // Hide tools popout when other panels are selected
      setIsToolsPopoutVisible(false);
    }
  };

  const handleToolsPopoutClose = () => {
    setIsToolsPopoutVisible(false);
    setActivePanelId(null);
  };

  // Check if any panel is active
  const hasSidePanelOpen = activePanelId !== null || isEditPanelInSidebar || isColourPanelInSidebar;

  return (
    <div className={`side-nav-container ${hasSidePanelOpen ? 'has-panel-open' : ''}`}>
      <SideNav
        activeId={activePanelId}
        onNavButtonClick={handleNavButtonClick}
        showCanvaAI={showCanvaAI}
        additionalNavItems={additionalNavItems}
      />

      {/* Regular sidebar panels */}
      {activePanelId && activePanelId !== 'tools' && (
        <div className="side-panel-container">
          {activePanelId === 'canva-ai' && <CanvaAIPanel onClose={() => setActivePanelId(null)} />}
          {activePanelId === 'design' && <LofiDesignPanel />}
          {activePanelId === 'elements' && <LofiElementsPanel />}
          {activePanelId === 'text' && <LofiTextPanel />}
          {activePanelId === 'brand' && <LofiBrandPanel />}
          {activePanelId === 'uploads' && <LofiUploadsPanel />}
          {activePanelId === 'projects' && <LofiProjectsPanel />}
          {activePanelId === 'apps' && <LofiAppsPanel />}
          {activePanelId === 'audio' && <AudioPanel />}
          {activePanelId === 'videos' && <VideoPanel />}
        </div>
      )}

      {/* Edit sidebar panel for navigation menu editing */}
      {isEditPanelInSidebar && (
        <div className="side-panel-container">
          <EditSidebarPanel />
        </div>
      )}

      {/* Colour sidebar panel for navigation menu color selection */}
      {isColourPanelInSidebar && (
        <div className="side-panel-container">
          <ColourSidebarPanel />
        </div>
      )}

      {/* Tools popout panel */}
      <LofiToolsPanel
        visible={isToolsPopoutVisible}
        position={toolsPopoutPosition}
        onClose={handleToolsPopoutClose}
        onToolSelect={toolId => {
          // Tool selected in side navigation
          // Optional: close popout after selection
          // setIsToolsPopoutVisible(false);
          // setActivePanelId(null);
        }}
      />
    </div>
  );
};

export default SideNavContainer;
