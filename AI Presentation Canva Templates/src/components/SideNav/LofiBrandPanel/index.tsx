import React, { useState, useRef, useEffect } from 'react';
import './style.css';

// IMAGE IMPORTS
import LofiBrandPanelTemplateIcon from './assets/icon-template.svg?react';
import LofiBrandPanelBrandKitIcon from './assets/icon-brand-kit.svg?react';

import SectionHeader from '@components/Objects/SectionHeader';
import ScrollableItemsRow from '@components/Objects/ScrollableItemsRow';

interface BrandItem {
  id: number;
  name: string;
}

interface FontStyle extends BrandItem {
  className: string;
}

interface ColorItem {
  id: number;
  color: string;
}

interface SectionHeaderProps {
  title: string;
}

interface ScrollableItemsRowProps {
  items: BrandItem[];
}

/**
 * Brand panel component that displays brand assets and styles
 */
const LofiBrandPanel: React.FC = () => {
  const [brandKitExpanded, setBrandKitExpanded] = useState<boolean>(false);

  // Sample data for brand sections
  const brandTemplates: BrandItem[] = [
    { id: 1, name: 'Template 1' },
    { id: 2, name: 'Template 2' },
    { id: 3, name: 'Template 3' },
    { id: 4, name: 'Template 4' },
  ];

  const logos: BrandItem[] = [
    { id: 1, name: 'Logo 1' },
    { id: 2, name: 'Logo 2' },
    { id: 3, name: 'Logo 3' },
    { id: 4, name: 'Logo 4' },
    { id: 5, name: 'Logo 5' },
    { id: 6, name: 'Logo 6' },
    { id: 7, name: 'Logo 7' },
    { id: 8, name: 'Logo 8' },
    { id: 9, name: 'Logo 9' },
    { id: 10, name: 'Logo 10' },
  ];

  const fontStyles: FontStyle[] = [
    { id: 1, name: 'Nike Heading', className: 'nike-heading' },
    { id: 2, name: 'Nike subheading', className: 'nike-subheading' },
    { id: 3, name: 'Body', className: 'body-text' },
  ];

  const brandColors: ColorItem[] = [
    { id: 1, color: '#000000' },
    { id: 2, color: '#FF6B00' },
    { id: 3, color: '#B9B9B9' },
  ];

  const backgroundColors: ColorItem[] = [
    { id: 1, color: '#FFFFFF' },
    { id: 2, color: '#F5F5F5' },
  ];

  const photos: BrandItem[] = [
    { id: 1, name: 'Photo 1' },
    { id: 2, name: 'Photo 2' },
    { id: 3, name: 'Photo 3' },
    { id: 4, name: 'Photo 4' },
    { id: 5, name: 'Photo 5' },
    { id: 6, name: 'Photo 6' },
    { id: 7, name: 'Photo 7' },
    { id: 8, name: 'Photo 8' },
    { id: 9, name: 'Photo 9' },
    { id: 10, name: 'Photo 10' },
  ];

  const graphics: BrandItem[] = [
    { id: 1, name: 'Graphic 1' },
    { id: 2, name: 'Graphic 2' },
    { id: 3, name: 'Graphic 3' },
    { id: 4, name: 'Graphic 4' },
    { id: 5, name: 'Graphic 5' },
    { id: 6, name: 'Graphic 6' },
    { id: 7, name: 'Graphic 7' },
    { id: 8, name: 'Graphic 8' },
    { id: 9, name: 'Graphic 9' },
    { id: 10, name: 'Graphic 10' },
  ];

  const icons: BrandItem[] = [
    { id: 1, name: 'Icon 1' },
    { id: 2, name: 'Icon 2' },
    { id: 3, name: 'Icon 3' },
    { id: 4, name: 'Icon 4' },
    { id: 5, name: 'Icon 5' },
    { id: 6, name: 'Icon 6' },
    { id: 7, name: 'Icon 7' },
    { id: 8, name: 'Icon 8' },
    { id: 9, name: 'Icon 9' },
    { id: 10, name: 'Icon 10' },
  ];

  return (
    <div className="lofi-brand-panel">
      {/* Brand Templates Section */}
      <div className="lofi-brand-section">
        <div className="lofi-brand-section-header">
          <div className="lofi-brand-section-title">
            <LofiBrandPanelTemplateIcon />

            <h3>Brand Templates</h3>
          </div>
          <a href="#" className="lofi-brand-see-all">
            See all
          </a>
        </div>
        <ScrollableItemsRow items={brandTemplates} />
      </div>

      {/* Nike Brand Kit */}

      <div className="lofi-brand-section">
        <div className="lofi-brand-section-header">
          <div className="lofi-brand-section-title">
            <LofiBrandPanelBrandKitIcon />

            <h3>Nike Brand Kit</h3>
          </div>
          <button
            className="lofi-brand-dropdown-btn"
            onClick={() => setBrandKitExpanded(!brandKitExpanded)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={brandKitExpanded ? 'M18 15L12 9L6 15' : 'M6 9L12 15L18 9'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* <ScrollableItemsRow items={brandTemplates} /> */}
      </div>

      {/* Logos Section */}
      <div className="lofi-brand-section">
        <SectionHeader title="Logos" />
        <ScrollableItemsRow items={logos} />
      </div>

      {/* Fonts Section */}
      <div className="lofi-brand-section">
        <SectionHeader title="Fonts" />
        <div className="lofi-brand-fonts-container">
          {fontStyles.map(font => (
            <div key={font.id} className="lofi-brand-font-item">
              <div className={font.className}>{font.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Colour Section */}
      <div className="lofi-brand-section">
        <SectionHeader title="Colour" />

        <div className="lofi-brand-subsection">
          <p className="lofi-brand-subsection-title">Brand colours</p>
          <div className="lofi-brand-color-placeholder"></div>
        </div>

        <div className="lofi-brand-subsection">
          <p className="lofi-brand-subsection-title">Background colors</p>
          <div className="lofi-brand-color-placeholder"></div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="lofi-brand-section">
        <SectionHeader title="Photos" />
        <ScrollableItemsRow items={photos} />
      </div>

      {/* Graphics Section */}
      <div className="lofi-brand-section">
        <SectionHeader title="Graphics" />
        <ScrollableItemsRow items={graphics} />
      </div>

      {/* Icons Section */}
      <div className="lofi-brand-section">
        <SectionHeader title="Icons" />
        <ScrollableItemsRow items={icons} />
      </div>
    </div>
  );
};

export default LofiBrandPanel;
