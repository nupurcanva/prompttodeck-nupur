import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WebsiteElementsCategory from './WebsiteElementsCategory';
import GenerateAIContentButton from '@components/Objects/GenerateAIContentButton';
import BasicSearchbar from '@components/Objects/BasicSearchbar';
import {
  type ItemBase,
  type ImageItem,
  type AudioItem,
  type ShapeItem,
  type TrendingItem,
  type ChartItem,
  type TableItem,
  type AiPrompt,
  filterCards,
  recentlyUsedItems,
  shapesItems,
  graphicsItems,
  aiPrompts,
  photosItems,
  videosItems,
  framesItems,
  chartsItems,
  audioItems,
  tablesItems,
  gridsItems,
  trendingCollections,
  headerItems,
  buttonItems,
  columnItems,
  linkItems,
  browseCategories,
} from './exampleData';
import './style.css';
import '../shared/scrollable.css';
import LeftArrowIcon from './assets/left-arrow.svg?react';
import RightArrowIcon from './assets/right-arrow.svg?react';

interface SectionBase {
  id: string;
  title: string;
  type: string;
  items:
    | ItemBase[]
    | ImageItem[]
    | AudioItem[]
    | ShapeItem[]
    | AiPrompt[]
    | TrendingItem[]
    | ChartItem[]
    | TableItem[];
}

// Scrollable row props interface
interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable ScrollableRow component with fade effects and navigation arrows
 */
const ScrollableRow: React.FC<ScrollableRowProps> = ({ children, className = '' }) => {
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
        behavior: 'smooth',
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      checkScroll();
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className="lofi-scrollable-container">
      <div className={`lofi-fade-left ${showLeftFade ? 'visible' : 'hidden'}`}>
        <div className="lofi-scroll-arrow-left" onClick={handleScrollLeft}>
          <LeftArrowIcon />
        </div>
      </div>
      <div className={`horizontal-scroll ${className}`} ref={scrollRef}>
        {children}
      </div>
      <div className={`lofi-fade-right ${showRightFade ? 'visible' : 'hidden'}`}>
        <div className="lofi-scroll-arrow" onClick={handleScrollRight}>
          <RightArrowIcon />
        </div>
      </div>
    </div>
  );
};

const LofiElementsPanel: React.FC = () => {
  const location = useLocation();

  // Enhanced detection for website view
  const isWebsiteView = (() => {
    // Primary check: exact website path
    if (location.pathname === '/website') return true;

    // Secondary check: path contains website
    if (location.pathname.includes('website')) return true;

    // For standalone website zips or when at root path
    if (location.pathname === '/' || location.pathname === '') {
      // Check document title
      if (document.title.toLowerCase().includes('website')) return true;

      // Check for website-specific DOM elements (more comprehensive)
      const websiteSelectors = [
        '.website-view',
        '.website-wrapper',
        '.website-container',
        '[class*="website"]',
        '[class*="Website"]',
        '.add-section-button',
        '.website-canvas',
        '.navigation-menu',
        '.publish-website-panel',
        '.website-preview-panel',
      ];

      for (const selector of websiteSelectors) {
        if (document.querySelector(selector)) return true;
      }

      // Check if we're in a single-view app (likely a website zip)
      // by checking if there are no other view navigation links
      const hasOtherViews = document.querySelector(
        '[href*="/docs"], [href*="/presentation"], [href*="/sheets"], [href*="/whiteboard"]',
      );
      if (!hasOtherViews) {
        // Additional check: look for website-specific text content
        const bodyText = document.body.textContent || '';
        if (bodyText.includes('Add Section') || bodyText.includes('Publish website')) {
          return true;
        }
      }
    }

    // Final fallback: if this is a website-only build, WebsiteElementsCategory should always show
    // This can be determined by checking if we only have website-related routes/components
    try {
      // Check if we're in a minimal app with only website functionality
      const currentUrl = window.location.href;
      const hasMultipleViews =
        currentUrl.includes('home') || document.querySelector('[href*="home"]');

      // If we don't have multiple views and we have website components, show website elements
      if (!hasMultipleViews && document.querySelector('.website-canvas, .add-section-button')) {
        return true;
      }
    } catch (e) {
      // Ignore errors in this detection
    }

    return false;
  })();

  // Sections data for consistent rendering
  const sections: SectionBase[] = [
    {
      id: 'recently-used',
      title: 'Recently used',
      type: 'scroll-grid',
      items: recentlyUsedItems,
    },
    {
      id: 'browse-categories',
      title: 'Browse categories',
      type: 'category-grid',
      items: browseCategories,
    },
    // COMMENTED OUT - Keeping for future use
    // {
    //   id: 'shapes',
    //   title: 'Shapes',
    //   type: 'shapes',
    //   items: shapesItems,
    // },
    // {
    //   id: 'graphics',
    //   title: 'Graphics for your design',
    //   type: 'scroll-grid',
    //   items: graphicsItems,
    // },
    // {
    //   id: 'ai-generator',
    //   title: 'AI image generator',
    //   type: 'ai',
    //   items: aiPrompts,
    // },
    // {
    //   id: 'photos',
    //   title: 'Photos for your design',
    //   type: 'scroll-grid',
    //   items: photosItems,
    // },
    // {
    //   id: 'videos',
    //   title: 'Videos',
    //   type: 'videos',
    //   items: videosItems,
    // },
    // {
    //   id: 'frames',
    //   title: 'Frames',
    //   type: 'scroll-grid',
    //   items: framesItems,
    // },
    // {
    //   id: 'charts',
    //   title: 'Charts',
    //   type: 'scroll-grid',
    //   items: chartsItems,
    // },
    // {
    //   id: 'audio',
    //   title: 'Audio',
    //   type: 'audio',
    //   items: audioItems,
    // },
    // {
    //   id: 'tables',
    //   title: 'Tables',
    //   type: 'tables',
    //   items: tablesItems,
    // },
    // {
    //   id: 'grids',
    //   title: 'Grids',
    //   type: 'scroll-grid',
    //   items: gridsItems,
    // },
    // {
    //   id: 'trending',
    //   title: 'Trending collections',
    //   type: 'trending',
    //   items: trendingCollections,
    // },
  ];

  // Render different types of section content
  const renderSectionContent = (section: SectionBase): React.ReactElement | null => {
    switch (section.type) {
      case 'grid':
        return (
          <div className="lofi-items-grid">
            {(section.items as any[]).map(item => (
              <div key={item.id} className="lofi-grid-item">
                {item.image && <img src={item.image} alt={item.title} />}
              </div>
            ))}
          </div>
        );

      case 'category-grid':
        return (
          <div className="lofi-browse-categories-grid">
            {(section.items as any[]).map(item => (
              <div key={item.id} className="lofi-category-card">
                <div className="lofi-category-card-image-container">
                  {item.image ? (
                    typeof item.image === 'string' ? (
                      <img src={item.image} alt={item.title} className="lofi-category-card-image" />
                    ) : (
                      <div className="lofi-category-card-image-react">{item.image}</div>
                    )
                  ) : (
                    <div className="lofi-category-card-image"></div>
                  )}
                </div>
                <div className="lofi-category-card-title">{item.title}</div>
              </div>
            ))}
          </div>
        );

      case 'scroll-grid':
        return (
          <ScrollableRow>
            {(section.items as any[]).map(item => (
              <div key={item.id} className="lofi-scroll-grid-item scroll-item">
                {item.image &&
                  (typeof item.image === 'string' ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    item.image
                  ))}
              </div>
            ))}
          </ScrollableRow>
        );

      case 'shapes':
        return (
          <ScrollableRow>
            {(section.items as ShapeItem[]).map(item => (
              <div key={item.id} className={`lofi-shape-item ${item.type} scroll-item`}></div>
            ))}
          </ScrollableRow>
        );

      case 'ai':
        return (
          <div className="lofi-ai-container">
            <div className="lofi-ai-examples">
              {(section.items as AiPrompt[]).map(prompt => (
                <div key={prompt.id} className="lofi-ai-example">
                  <div className="lofi-ai-image">
                    {typeof prompt.image === 'string' ? <img src={prompt.image} /> : prompt.image}
                  </div>
                  <p className="lofi-ai-prompt">{prompt.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'videos':
        return (
          <ScrollableRow>
            {section.items.map(item => (
              <div key={item.id} className="lofi-video-item scroll-item">
                <div className="lofi-video-indicator"></div>
              </div>
            ))}
          </ScrollableRow>
        );

      case 'audio':
        return (
          <div className="lofi-audio-list">
            {(section.items as AudioItem[]).map(audio => (
              <div key={audio.id} className="lofi-audio-item">
                {typeof audio.image === 'string' ? (
                  <div className="lofi-audio-thumbnail">
                    <img src={audio.image} />
                  </div>
                ) : (
                  audio.image
                )}
                <div className="lofi-audio-info">
                  <div className="lofi-audio-title">{audio.title}</div>
                  <div className="lofi-audio-meta">
                    {audio.artist} • {audio.duration}
                    <div className="lofi-audio-genre">{audio.genre || audio.mood}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'tables':
        return (
          <div className="lofi-tables-grid">
            {(section.items as TableItem[]).map(item => (
              <div key={item.id} className="lofi-table-item">
                {typeof item.image === 'string' ? (
                  <img src={item.image} alt={item.title} />
                ) : (
                  item.image
                )}
              </div>
            ))}
          </div>
        );

      case 'trending':
        return (
          <ScrollableRow className="lofi-trending-collections-scroll">
            {(section.items as TrendingItem[]).map(item => (
              <div key={item.id} className="lofi-trending-item-container">
                <div className="lofi-trending-item-image">
                  {typeof item.image === 'string' ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    item.image
                  )}
                </div>
                <div className="lofi-trending-item-content">
                  <p className="lofi-trending-item-title">{item.title}</p>
                  <p className="lofi-trending-item-subtitle">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </ScrollableRow>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lofi-elements-panel">
      {/* Sticky header container */}
      <div className="lofi-elements-sticky-header">
        {/* Search bar */}
        <div className="lofi-search-container">
          <BasicSearchbar sampleText="Search elements" extended={true} />
        </div>

        {/* Horizontal scrollable cards */}
      </div>

      <div className="lofi-cards-scroll-container">
        <ScrollableRow>
          {filterCards.map(card => (
            <div key={card.id} className="lofi-card-item scroll-item"></div>
          ))}
        </ScrollableRow>
      </div>

      <div className="lofi-generate-images-button-container">
        <GenerateAIContentButton text="Generate Images" showDropdown={true} />
      </div>

      {/* Scrollable content */}
      <div className="lofi-elements-scrollable-content">
        {/* Website-specific category (only in website view) */}
        {isWebsiteView && <WebsiteElementsCategory />}

        {/* Render all sections */}
        {sections.map(section => (
          <div key={section.id} id={section.id} className="lofi-section-container">
            <div className="lofi-section-header">
              <h3>{section.title}</h3>
              <a href="#" className="lofi-see-all-link">
                See all
              </a>
            </div>
            {renderSectionContent(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LofiElementsPanel;
