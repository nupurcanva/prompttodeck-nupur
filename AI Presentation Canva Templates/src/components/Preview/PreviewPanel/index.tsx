import React from 'react';
import WebsiteIcon from '@components/Preview/PreviewPanel/assets/thumbnail-website-preview-black.svg?react';
import WebsiteIconWhite from '@components/Preview/PreviewPanel/assets/thumbnail-website-preview-white.svg?react';
import PresentationIcon from '@components/Preview/PreviewPanel/assets/thumbnail-presentation-preview-black.svg?react';
import PresentationIconWhite from '@components/Preview/PreviewPanel/assets/thumbnail-presentation-preview-white.svg?react';

import './style.css';

interface Canvas {
  id: number;
  color?: string;
  title?: string;
  pageName?: string;
}

interface PreviewPanelProps {
  canvases?: Canvas[];
  activeCanvasId?: number;
  onCanvasSelect?: (id: number) => void;
  onAddCanvas?: () => void;
  viewType?: 'presentation' | 'website' | 'docs' | 'whiteboard' | 'sheets' | 'video';
  isPreviewMode?: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  canvases = [],
  activeCanvasId,
  onCanvasSelect,
  onAddCanvas,
  viewType = 'presentation',
  isPreviewMode = false,
}) => {
  // Function to determine if a color is dark (to choose white or black text/icon)
  const isDarkColor = (hexColor?: string): boolean => {
    // Default to false for empty/undefined colors
    if (!hexColor) return false;

    // Remove the # if it exists
    const hex = hexColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness (using YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return true if the color is dark (brightness < 128)
    return brightness < 128;
  };

  // Get the appropriate icon based on view type and color
  const getIconPath = (isDark: boolean): React.ReactNode => {
    switch (viewType) {
      case 'website':
        return isDark ? <WebsiteIconWhite /> : <WebsiteIcon />;
      case 'presentation':
      default:
        return isDark ? <PresentationIconWhite /> : <PresentationIcon />;
    }
  };

  // Get the display text for the thumbnail
  const getDisplayText = (canvas: Canvas, index: number): string => {
    if (viewType === 'website') {
      return canvas.title || `Page ${index + 1}`;
    }
    return `${index + 1}`;
  };

  return (
    <div className="preview-panel">
      <div className="preview-header"></div>
      <div className="preview-thumbnails">
        {canvases.map((canvas, index) => {
          const isDark = isDarkColor(canvas.color);
          const iconPath = getIconPath(isDark);
          const displayText = getDisplayText(canvas, index);

          return (
            <div
              key={canvas.id}
              className={`canvas-thumbnail ${canvas.id === activeCanvasId ? 'active' : ''}`}
              onClick={() => onCanvasSelect && onCanvasSelect(canvas.id)}
            >
              <div
                className="thumbnail-content"
                style={{ backgroundColor: canvas.color || 'white' }}
              >
                {/* Empty div for displaying canvas preview */}
              </div>
              <div className="thumbnail-label" style={{ color: isDark ? 'white' : 'black' }}>
                <div className="thumbnail-icon">{iconPath}</div>
                <span>{displayText}</span>
              </div>
            </div>
          );
        })}

        {/* Add page split button - hide in preview mode */}
        {!isPreviewMode && (
          <div className="add-page-split-button">
            <button
              className="add-button"
              onClick={() => onAddCanvas && onAddCanvas()}
              aria-label="Add Page"
            >
              <span className="icon">+</span>
            </button>
            <button
              className="dropdown-button"
              onClick={() => {
                /* Dropdown functionality placeholder */
              }}
              aria-label="Show Page Options"
            >
              <span className="icon">▾</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
