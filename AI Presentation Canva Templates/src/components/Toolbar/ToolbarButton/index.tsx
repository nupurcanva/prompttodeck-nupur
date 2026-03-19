import React, { useState, ReactNode } from "react";
import styles from "./ToolbarButton.module.css";

interface ToolbarButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  width?: number;
  height?: number;
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  width = 32,
  height = 32,
  isActive = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`${styles.elementToolbarButton} ${isHovered ? styles.hovered : ""} ${isActive ? styles.active : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={label}
      style={{ width, height }}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;
