import React, { useState, useRef } from 'react';
import './style.css';
import GenerateAIContentButton from '@components/Objects/GenerateAIContentButton';
import BasicSearchbar from '@components/Objects/BasicSearchbar';
import BasicTabs from '@components/Objects/BasicTabs';
import { tabItems, recentlyUsedItems, allResults } from './exampleData';

const LofiDesignPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const recentScrollRef = useRef<HTMLDivElement>(null);

  // Check scroll position to show/hide left fade
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const container = target.parentElement;

    if (container) {
      if (target.scrollLeft > 10) {
        container.classList.add('scrolled-left');
      } else {
        container.classList.remove('scrolled-left');
      }
    }
  };

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="lofi-design-panel">
      {/* Sticky header section */}
      <div className="lofi-sticky-header">
        {/* Search bar */}
        <div className="lofi-search-container">
          <BasicSearchbar sampleText="Describe your ideal design" extended={true} />
        </div>
      </div>

      {/* Tabs */}
      <div className="lofi-tabs-container">
        <BasicTabs tabs={tabItems} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      <div className="lofi-generate-images-button-container">
        <GenerateAIContentButton text="Generate Design" />
      </div>

      {/* Scrollable content */}
      <div className="lofi-scrollable-content">
        {/* Recently used section */}
        <div className="lofi-section-container">
          <div className="lofi-section-header">
            <h3>Recently used</h3>
            <a href="#" className="lofi-see-all-link">
              See all
            </a>
          </div>
          <div className="scrollable-container">
            <div className="horizontal-scroll" ref={recentScrollRef} onScroll={handleScroll}>
              {recentlyUsedItems.map(item => (
                <div key={item.id} className="lofi-grid-item-large scroll-item"></div>
              ))}
            </div>
          </div>
        </div>

        {/* All results section */}
        <div className="lofi-section-container">
          <div className="lofi-section-header">
            <h3>All</h3>
          </div>
          <div className="lofi-items-grid">
            {allResults.map(item => (
              <div key={item.id} className="lofi-grid-item"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LofiDesignPanel;
