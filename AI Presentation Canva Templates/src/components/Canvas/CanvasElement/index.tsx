import React, { useState } from "react";
import styles from "./CanvasElement.module.css";

// Import placeholder images
import ImagePlaceholder from "@assets/icons/canvas-icons/image-placeholder.svg";
import ShapePlaceholder from "@assets/icons/canvas-icons/shape-placeholder.svg";
import TextPlaceholder from "@assets/icons/canvas-icons/text-placeholder.svg";
import VideoPlaceholder from "@assets/icons/canvas-icons/video-placeholder.svg";
import ToolbarSelection from "@assets/icons/toolbars/toolbar-selection.svg";

interface CanvasElementProps {
  type: "image" | "shape" | "text" | "video";
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  isSelected?: boolean;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  type,
  style,
  onClick,
  isSelected = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const getImagePath = (): string => {
    switch (type) {
      case "image":
        return ImagePlaceholder;
      case "shape":
        return ShapePlaceholder;
      case "text":
        return TextPlaceholder;
      case "video":
        return VideoPlaceholder;
      default:
        return "";
    }
  };

  const handleClick = (event: React.MouseEvent): void => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleMouseEnter = (): void => {
    setIsHovering(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovering(false);
  };

  const handleToolbarClick = (event: React.MouseEvent): void => {
    // Prevent clicks on the toolbar from deselecting the element
    event.stopPropagation();
  };

  // Create resize handles when element is selected
  const renderResizeHandles = (): React.ReactNode => {
    if (!isSelected) return null;

    return (
      <>
        {/* Corner handles */}
        <div className={`${styles.resizeHandle} ${styles.corner} ${styles.topLeft}`}></div>
        <div className={`${styles.resizeHandle} ${styles.corner} ${styles.topRight}`}></div>
        <div className={`${styles.resizeHandle} ${styles.corner} ${styles.bottomLeft}`}></div>
        <div className={`${styles.resizeHandle} ${styles.corner} ${styles.bottomRight}`}></div>

        {/* Side handles */}
        <div className={`${styles.resizeHandle} ${styles.side} ${styles.top}`}></div>
        <div className={`${styles.resizeHandle} ${styles.side} ${styles.right}`}></div>
        <div className={`${styles.resizeHandle} ${styles.side} ${styles.bottom}`}></div>
        <div className={`${styles.resizeHandle} ${styles.side} ${styles.left}`}></div>

        {/* Rotation handle */}
        <div className={styles.rotateHandle}></div>

        {/* Selection toolbar */}
        <div className={styles.selectionToolbar} onClick={handleToolbarClick}>
          <img src={ToolbarSelection} alt="Selection Toolbar" className={styles.selectionToolbarSvg} />
        </div>
      </>
    );
  };

  const getElementTypeClass = () => {
    if (type === 'image') return styles.imageElement;
    if (type === 'shape') return styles.shapeElement;
    if (type === 'text') return styles.textElement;
    if (type === 'video') return styles.videoElement;
    return '';
  };

  const elementClassName = `${styles.canvasElement} ${getElementTypeClass()} ${
    isHovering && !isSelected ? styles.hovering : ""
  } ${isSelected ? styles.selected : ""}`;

  return (
    <div
      className={elementClassName}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={getImagePath()} alt={`${type} element`} />
      {renderResizeHandles()}
    </div>
  );
};

export default CanvasElement;
