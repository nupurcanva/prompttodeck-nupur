import React, { ReactElement } from "react";
import {
  TextToolbar,
  ImageToolbar,
  ShapeToolbar,
  VideoToolbar,
  CanvasToolbar,
} from "../index";
import NavigationMenuToolbar from "../NavigationMenuToolbar";
import styles from "./ToolbarContainer.module.css";

interface ToolbarContainerProps {
  selectedType: string | null;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({ selectedType }) => {
  let toolbar: ReactElement | null = null;

  switch (selectedType) {
    case "canvas":
      toolbar = <CanvasToolbar />;
      break;
    case "text":
      toolbar = <TextToolbar />;
      break;
    case "image":
      toolbar = <ImageToolbar />;
      break;
    case "shape":
      toolbar = <ShapeToolbar />;
      break;
    case "video":
      toolbar = <VideoToolbar />;
      break;
    case "navigation-menu":
      toolbar = <NavigationMenuToolbar />;
      break;
    default:
      toolbar = null;
  }

  return <div className={styles.toolbarContainer}>{toolbar}</div>;
};

export default ToolbarContainer;
