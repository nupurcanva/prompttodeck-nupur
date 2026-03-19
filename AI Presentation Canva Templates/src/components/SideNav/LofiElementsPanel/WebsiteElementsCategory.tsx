import React, { useState, useRef, useEffect } from "react";

// WEBSITE SPECIFIC ITEMS
import NavMenu1 from "./assets/Carousel/navigation-menu-1.svg?react";
import NavMenu2 from "./assets/Carousel/Navigation menu-1.svg?react";
import NavMenu3 from "./assets/Carousel/Navigation menu-2.svg?react";

// import Button1 from "./assets/button1.svg?react";
// import Button2 from "./assets/button2.svg?react";
// import Button3 from "./assets/button3.svg?react";
// import Footer1 from "./assets/footer1.svg?react";
// import Footer2 from "./assets/footer2.svg?react";
// import Footer3 from "./assets/footer3.svg?react";

interface WebsiteItem {
  id: string;
  title?: string;
  type: "navigation" | "header" | "footer" | "form" | "button" | "banner";
  description?: string;
  image?: React.ReactElement;
}

interface WebsiteSection {
  id: string;
  title: string;
  items: WebsiteItem[];
}

// Scrollable row props interface
interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable ScrollableRow component with fade effects and navigation arrows
 */
const ScrollableRow: React.FC<ScrollableRowProps> = ({ children, className = "" }) => {
  const [showLeftFade, setShowLeftFade] = useState<boolean>(false);
  const [showRightFade, setShowRightFade] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Show left fade only if scrolled to the right
      setShowLeftFade(scrollLeft > 0);

      // Show right fade only if there's more content to scroll to
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      checkScroll();
      scrollElement.addEventListener("scroll", checkScroll);
      return () => scrollElement.removeEventListener("scroll", checkScroll);
    }
  }, []);

  return (
    <div className="lofi-scrollable-container">
      <div className={`lofi-fade-left ${showLeftFade ? "visible" : "hidden"}`}>
        <div className="lofi-scroll-arrow-left" onClick={handleScrollLeft}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className={`horizontal-scroll ${className}`} ref={scrollRef}>
        {children}
      </div>
      <div className={`lofi-fade-right ${showRightFade ? "visible" : "hidden"}`}>
        <div className="lofi-scroll-arrow" onClick={handleScrollRight}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const WebsiteElementsCategory: React.FC = () => {
  // Handle navigation menu item click
  const handleNavigationMenuClick = (menuType: string) => {
    // Dispatch a custom event to add navigation menu to canvas
    const addNavEvent = new CustomEvent("navigation-menu-add", {
      detail: { menuType },
    });
    window.dispatchEvent(addNavEvent);
  };

  // Website-specific sections organized by category
  const websiteSections: WebsiteSection[] = [
    {
      id: "navigation-menu",
      title: "Navigation Menu",
      items: [
        {
          id: "nav-1",
          type: "navigation",
          title: "menu-1",
          image: <NavMenu1 />,
        },
        {
          id: "nav-2",
          type: "navigation",
          title: "menu-2",
          image: <NavMenu2 />,
        },
        {
          id: "nav-3",
          type: "navigation",
          title: "menu-3",
          image: <NavMenu3 />,
        },
      ],
    },
    // Temporarily commented out - buttons and footers sections
    // {
    //   id: "buttons",
    //   title: "Buttons",
    //   items: [
    //     {
    //       id: "button-1",
    //       type: "button",
    //       image: <Button1 />,
    //     },
    //     {
    //       id: "button-2",
    //       type: "button",
    //       image: <Button2 />,
    //     },
    //     {
    //       id: "button-3",
    //       type: "button",
    //       image: <Button3 />,
    //     },
    //   ],
    // },
    // {
    //   id: "footers",
    //   title: "Footers",
    //   items: [
    //     {
    //       id: "footer-1",
    //       type: "footer",
    //       image: <Footer1 />,
    //     },
    //     {
    //       id: "footer-2",
    //       type: "footer",
    //       image: <Footer2 />,
    //     },
    //     {
    //       id: "footer-3",
    //       type: "footer",
    //       image: <Footer3 />,
    //     },
    //   ],
    // },
  ];

  const renderSectionContent = (section: WebsiteSection) => {
    if (section.id === "navigation-menu") {
      // Use large navigation menu style for navigation
      return (
        <ScrollableRow className="website-components-scroll">
          <div className="lofi-navigation-menu-container">
            {section.items.map(item => (
              <div
                key={item.id}
                className="lofi-navigation-menu-item clickable"
                onClick={() => handleNavigationMenuClick(item.title || item.id)}
              >
                <div className="lofi-navigation-image">{item.image}</div>
              </div>
            ))}
          </div>
        </ScrollableRow>
      );
    } else {
      // Use smaller scroll grid style for buttons and footers
      return (
        <ScrollableRow className="website-components-scroll">
          {section.items.map(item => (
            <div key={item.id} className="lofi-scroll-grid-item">
              {item.image || null}
            </div>
          ))}
        </ScrollableRow>
      );
    }
  };

  return (
    <>
      {websiteSections.map(section => (
        <div key={section.id} className="lofi-section-container" id={section.id}>
          <div className="lofi-section-header">
            <h3>{section.title}</h3>
            <a href="#" className="lofi-see-all-link">
              See all
            </a>
          </div>
          {renderSectionContent(section)}
        </div>
      ))}
    </>
  );
};

export default WebsiteElementsCategory;
