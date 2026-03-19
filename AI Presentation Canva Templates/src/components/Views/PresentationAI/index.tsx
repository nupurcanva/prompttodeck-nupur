import React, { useState, useEffect } from "react";
import NavigationContainer from "../../Layouts/NavigationContainer";
import MainContainer from "../../Layouts/MainContainer";
import HomeMenu from "../Homepage/HomeMenu";
import { ChatGPTPreviewProvider } from "@/contexts/ChatGPTPreviewContext";
import "./style.css";
// Import all CSS files

const PresentationView: React.FC = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | undefined>(undefined);

  const handleMenuItemClick = (id: string) => {
    setActiveMenuItem(id === activeMenuItem ? undefined : id);
  };

  const handleMenuToggle = (expanded: boolean) => {
    setIsMenuExpanded(expanded);

    // Add or remove body class for global styling effects
    if (expanded) {
      document.body.classList.add("menu-expanded");
    } else {
      document.body.classList.remove("menu-expanded");
    }
  };

  const toggleMenu = () => {
    const newExpandedState = !isMenuExpanded;
    setIsMenuExpanded(newExpandedState);

    // Also call handleMenuToggle to ensure HomeMenu is synced with this state
    handleMenuToggle(newExpandedState);
  };

  // Clean up body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("menu-expanded");
    };
  }, []);

  return (
    <div
      className={`presentation-wrapper presentation-view ${isMenuExpanded ? "menu-expanded" : ""}`}
    >
      <HomeMenu
        activeItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
        onMenuToggle={handleMenuToggle}
        isMenuExpanded={isMenuExpanded}
      />
      <ChatGPTPreviewProvider>
        <NavigationContainer onMenuToggle={toggleMenu} showCanvaAI={true} isCanvaAIView={true}>
          <MainContainer />
        </NavigationContainer>
      </ChatGPTPreviewProvider>
    </div>
  );
};

export default PresentationView;
