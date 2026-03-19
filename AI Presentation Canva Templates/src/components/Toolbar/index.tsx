/**
 * Toolbar Exports
 * 
 * All toolbar components exported from a single location.
 * Simple toolbars use the DynamicToolbar component with predefined configs.
 */

import React from 'react';
import DynamicToolbar from './toolbar';
import {
  TEXT_TOOLBAR_CONFIG,
  IMAGE_TOOLBAR_CONFIG,
  SHAPE_TOOLBAR_CONFIG,
  VIDEO_TOOLBAR_CONFIG,
  CANVAS_TOOLBAR_CONFIG,
} from './toolbarConfig';

/**
 * TextToolbar
 * Toolbar for text editing operations.
 */
export const TextToolbar: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Text toolbar button clicked: ${buttonName}`);
  };

  return (
    <DynamicToolbar
      config={TEXT_TOOLBAR_CONFIG}
      onButtonClick={handleButtonClick}
      gap="4px"
    />
  );
};

/**
 * ImageToolbar
 * Toolbar for image editing operations.
 */
export const ImageToolbar: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Image toolbar button clicked: ${buttonName}`);
  };

  return (
    <DynamicToolbar
      config={IMAGE_TOOLBAR_CONFIG}
      onButtonClick={handleButtonClick}
    />
  );
};

/**
 * ShapeToolbar
 * Toolbar for shape editing operations with text formatting.
 */
export const ShapeToolbar: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Shape toolbar button clicked: ${buttonName}`);
  };

  return (
    <DynamicToolbar
      config={SHAPE_TOOLBAR_CONFIG}
      onButtonClick={handleButtonClick}
      gap="4px"
    />
  );
};

/**
 * VideoToolbar
 * Toolbar for video editing operations.
 */
export const VideoToolbar: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Video toolbar button clicked: ${buttonName}`);
  };

  return (
    <DynamicToolbar
      config={VIDEO_TOOLBAR_CONFIG}
      onButtonClick={handleButtonClick}
      gap="4px"
    />
  );
};

/**
 * CanvasToolbar
 * Toolbar for canvas/artboard-level operations.
 */
export const CanvasToolbar: React.FC = () => {
  const handleButtonClick = (buttonName: string) => {
    console.log(`Canvas toolbar button clicked: ${buttonName}`);
  };

  return (
    <DynamicToolbar
      config={CANVAS_TOOLBAR_CONFIG}
      onButtonClick={handleButtonClick}
      gap="4px"
    />
  );
};

// Re-export other toolbar components
export { default as ToolbarButton } from './ToolbarButton';
export { default as ToolbarContainer } from './ToolbarContainer';
export { default as DynamicToolbar } from './toolbar';

// Re-export toolbar configuration
export * from './toolbarConfig';

// NOTE: Custom toolbars (NavigationMenuToolbar, NavigationSubToolbar, ArtboardsToolbar)
// are NOT re-exported here to avoid issues with standalone zips.
// Import them directly from their respective directories when needed:
// import NavigationMenuToolbar from '@components/Toolbar/NavigationMenuToolbar';
// import NavigationSubToolbar from '@components/Toolbar/NavigationSubToolbar';
// import ArtboardsToolbar from '@components/Toolbar/ArtboardsToolbar';

