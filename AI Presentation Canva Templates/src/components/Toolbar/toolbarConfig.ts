/**
 * Centralized Toolbar Configuration
 * 
 * This file contains all button definitions and toolbar configurations.
 * Each button is defined once and can be reused across multiple toolbars.
 */

// Import all button icons as React components
import FontFamilyIcon from '@components/Toolbar/assets/button-fontfamily.svg?react';
import FontSizeIcon from '@components/Toolbar/assets/button-fontsize.svg?react';
import TextColorIcon from '@components/Toolbar/assets/button-textcolor.svg?react';
import BoldIcon from '@components/Toolbar/assets/button-fontformat-bold.svg?react';
import ItalicIcon from '@components/Toolbar/assets/button-fontformat-italics.svg?react';
import UnderlineIcon from '@components/Toolbar/assets/button-fontformat-underline.svg?react';
import StrikethroughIcon from '@components/Toolbar/assets/button-fontformat-strikethrough.svg?react';
import AlignmentIcon from '@components/Toolbar/assets/button-fontformat-alignment.svg?react';
import ListIcon from '@components/Toolbar/assets/button-fontformat-list.svg?react';
import SpacingIcon from '@components/Toolbar/assets/button-fontformat-spacing.svg?react';
import UppercaseIcon from '@components/Toolbar/assets/button-fontformat-uppercase.svg?react';
import AdvancedIcon from '@components/Toolbar/assets/button-fontformat-advanced.svg?react';
import ShapeIcon from '@components/Toolbar/assets/button-shape.svg?react';
import FillIcon from '@components/Toolbar/assets/button-fill.svg?react';
import BorderIcon from '@components/Toolbar/assets/button-border.svg?react';
import RoundingIcon from '@components/Toolbar/assets/button-rounding.svg?react';
import EditIcon from '@components/Toolbar/assets/button-edit.svg?react';
import BgRemoverIcon from '@components/Toolbar/assets/button-bgremover.svg?react';
import CropIcon from '@components/Toolbar/assets/button-crop.svg?react';
import FlipIcon from '@components/Toolbar/assets/button-flip.svg?react';
import VideoTrimIcon from '@components/Toolbar/assets/button-videotrim.svg?react';
import SpeedIcon from '@components/Toolbar/assets/button-speed.svg?react';
import PlaybackIcon from '@components/Toolbar/assets/button-playback.svg?react';
import CommentIcon from '@components/Toolbar/assets/button-comment.svg?react';
import DurationIcon from '@components/Toolbar/assets/button-duration.svg?react';
import TransparencyIcon from '@components/Toolbar/assets/button-transparency.svg?react';
import EffectsIcon from '@components/Toolbar/assets/button-effects.svg?react';
import AnimateIcon from '@components/Toolbar/assets/button-animate.svg?react';
import PositionIcon from '@components/Toolbar/assets/button-position.svg?react';
import CopyStyleIcon from '@components/Toolbar/assets/button-copystyle.svg?react';

// ============================================================================
// TYPES
// ============================================================================

export interface ButtonDefinition {
  name: string;
  label: string;
  icon: React.ComponentType; // Store the component itself, not JSX
  width?: number;
  onClick?: () => void;
}

export type ToolbarItem = string | 'divider';
export type ToolbarConfig = ToolbarItem[];

// ============================================================================
// BUTTON REGISTRY
// ============================================================================

/**
 * Central registry of all toolbar buttons.
 * Each button is defined once with its name, label, icon path, and optional width.
 * 
 * Icon paths point to the shared buttons directory.
 */
export const BUTTON_REGISTRY: Record<string, ButtonDefinition> = {
  // ========== FONT CONTROLS ==========
  fontFamily: {
    name: 'fontFamily',
    label: 'Font Family',
    icon: FontFamilyIcon,
    width: 136,
  },
  
  fontSize: {
    name: 'fontSize',
    label: 'Font Size',
    icon: FontSizeIcon,
    width: 104,
  },
  
  textColor: {
    name: 'textColor',
    label: 'Text Color',
    icon: TextColorIcon,
  },
  
  // ========== TEXT FORMATTING ==========
  bold: {
    name: 'bold',
    label: 'Bold',
    icon: BoldIcon,
    width: 40,
  },
  
  italic: {
    name: 'italic',
    label: 'Italic',
    icon: ItalicIcon,
    width: 40,
  },
  
  underline: {
    name: 'underline',
    label: 'Underline',
    icon: UnderlineIcon,
    width: 40,
  },
  
  strikethrough: {
    name: 'strikethrough',
    label: 'Strikethrough',
    icon: StrikethroughIcon,
    width: 40,
  },
  
  // ========== TEXT ALIGNMENT & LIST ==========
  alignment: {
    name: 'alignment',
    label: 'Alignment',
    icon: AlignmentIcon,
    width: 40,
  },
  
  list: {
    name: 'list',
    label: 'List',
    icon: ListIcon,
    width: 40,
  },
  
  spacing: {
    name: 'spacing',
    label: 'Spacing',
    icon: SpacingIcon,
    width: 40,
  },
  
  uppercase: {
    name: 'uppercase',
    label: 'Uppercase',
    icon: UppercaseIcon,
    width: 40,
  },
  
  advanced: {
    name: 'advanced',
    label: 'Advanced',
    icon: AdvancedIcon,
    width: 40,
  },
  
  // ========== SHAPE & STYLE ==========
  shape: {
    name: 'shape',
    label: 'Shape',
    icon: ShapeIcon,
    width: 76,
  },
  
  fill: {
    name: 'fill',
    label: 'Fill',
    icon: FillIcon,
  },
  
  border: {
    name: 'border',
    label: 'Border',
    icon: BorderIcon,
  },
  
  stroke: {
    name: 'stroke',
    label: 'Stroke',
    icon: BorderIcon,
  },
  
  rounding: {
    name: 'rounding',
    label: 'Rounding',
    icon: RoundingIcon,
  },
  
  // ========== IMAGE & VIDEO EDITING ==========
  edit: {
    name: 'edit',
    label: 'Edit',
    icon: EditIcon,
    width: 76,
  },
  
  bgRemover: {
    name: 'bgRemover',
    label: 'BG Remover',
    icon: BgRemoverIcon,
    width: 131,
  },
  
  crop: {
    name: 'crop',
    label: 'Crop',
    icon: CropIcon,
  },
  
  flip: {
    name: 'flip',
    label: 'Flip',
    icon: FlipIcon,
    width: 50,
  },
  
  // ========== VIDEO-SPECIFIC ==========
  videoTrim: {
    name: 'videoTrim',
    label: 'Video Trim',
    icon: VideoTrimIcon,
    width: 100,
  },
  
  speed: {
    name: 'speed',
    label: 'Speed',
    icon: SpeedIcon,
  },
  
  playback: {
    name: 'playback',
    label: 'Playback',
    icon: PlaybackIcon,
  },
  
  // ========== CANVAS & EFFECTS ==========
  comment: {
    name: 'comment',
    label: 'Comment',
    icon: CommentIcon,
  },
  
  duration: {
    name: 'duration',
    label: 'Duration',
    icon: DurationIcon,
    width: 76,
  },
  
  transparency: {
    name: 'transparency',
    label: 'Transparency',
    icon: TransparencyIcon,
  },
  
  effects: {
    name: 'effects',
    label: 'Effects',
    icon: EffectsIcon,
  },
  
  animate: {
    name: 'animate',
    label: 'Animate',
    icon: AnimateIcon,
    width: 105,
  },
  
  position: {
    name: 'position',
    label: 'Position',
    icon: PositionIcon,
    width: 80,
  },
  
  copyStyle: {
    name: 'copyStyle',
    label: 'Copy Style',
    icon: CopyStyleIcon,
  },
};

// ============================================================================
// TOOLBAR CONFIGURATIONS
// ============================================================================

/**
 * Text Toolbar Configuration
 * Used when text elements are selected
 */
export const TEXT_TOOLBAR_CONFIG: ToolbarConfig = [
  // Font options
  'fontFamily',
  'fontSize',
  'textColor',
  'divider',
  
  // Text formatting
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'divider',
  
  // Text alignment and formatting
  'alignment',
  'list',
  'spacing',
  'uppercase',
  'advanced',
  'divider',
  
  // Effects
  'transparency',
  'divider',
  'effects',
  'divider',
  'animate',
  'divider',
  'position',
  'divider',
  'copyStyle',
];

/**
 * Image Toolbar Configuration
 * Used when image elements are selected
 */
export const IMAGE_TOOLBAR_CONFIG: ToolbarConfig = [
  'edit',
  'divider',
  'bgRemover',
  'divider',
  'fill',
  'stroke',
  'rounding',
  'divider',
  'crop',
  'flip',
  'divider',
  'transparency',
  'divider',
  'animate',
  'divider',
  'position',
  'divider',
  'copyStyle',
];

/**
 * Shape Toolbar Configuration
 * Used when shape elements are selected
 */
export const SHAPE_TOOLBAR_CONFIG: ToolbarConfig = [
  'shape',
  'divider',
  
  // Color and style
  'fill',
  'border',
  'rounding',
  'divider',
  
  // Font options
  'fontFamily',
  'fontSize',
  'textColor',
  'divider',
  
  // Text formatting
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'divider',
  
  // Text alignment
  'alignment',
  'list',
  'spacing',
  'uppercase',
  'advanced',
  'divider',
  
  // Effects
  'transparency',
  'animate',
  'divider',
  'position',
  'divider',
  'copyStyle',
];

/**
 * Video Toolbar Configuration
 * Used when video elements are selected
 */
export const VIDEO_TOOLBAR_CONFIG: ToolbarConfig = [
  'edit',
  'divider',
  'videoTrim',
  'bgRemover',
  'speed',
  'playback',
  'divider',
  'border',
  'rounding',
  'divider',
  'crop',
  'flip',
  'divider',
  'transparency',
  'divider',
  'animate',
  'divider',
  'position',
  'divider',
  'copyStyle',
];

/**
 * Canvas Toolbar Configuration
 * Used when canvas/artboard elements are selected
 */
export const CANVAS_TOOLBAR_CONFIG: ToolbarConfig = [
  'comment',
  'divider',
  'fill',
  'divider',
  'duration',
  'divider',
  'position',
  'divider',
  'copyStyle',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get button definition by name
 */
export function getButton(name: string): ButtonDefinition | undefined {
  return BUTTON_REGISTRY[name];
}

/**
 * Get all button names from a toolbar config
 */
export function getButtonNames(config: ToolbarConfig): string[] {
  return config.filter((item): item is string => item !== 'divider');
}

/**
 * Validate toolbar config (checks if all buttons exist)
 */
export function validateToolbarConfig(config: ToolbarConfig): boolean {
  const buttonNames = getButtonNames(config);
  return buttonNames.every(name => name in BUTTON_REGISTRY);
}

