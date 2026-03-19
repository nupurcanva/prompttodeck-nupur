import React, { useState } from "react";
import "./style.css";

// IMAGE IMPORTS
import LofiToolsPanelCloseIcon from "./assets/tools-close.svg?react";
import LofiToolsPanelSelectIcon from "./assets/tools-select.svg?react";
import LofiToolsPanelShapesIcon from "./assets/tools-shapes.svg?react";
import LofiToolsPanelTextIcon from "./assets/tools-text.svg?react";
import LofiToolsPanelDrawIcon from "./assets/tools-draw.svg?react";
import LofiToolsPanelLinesIcon from "./assets/tools-lines.svg?react";
import LofiToolsPanelStickyNotesIcon from "./assets/tools-sticky-notes.svg?react";
import LofiToolsPanelTablesIcon from "./assets/tools-tables.svg?react";

interface Tool {
  id: string;
  name: string;
  icon: string | React.ReactElement;
  color?: string;
}

interface LofiToolsPanelProps {
  onToolSelect?: (toolId: string) => void;
  position?: { top: number; left: number };
  onClose?: () => void;
  visible?: boolean;
}

const LofiToolsPanel: React.FC<LofiToolsPanelProps> = ({
  onToolSelect,
  position = { top: 300, left: 84 },
  onClose,
  visible = true,
}) => {
  const [activeToolId, setActiveToolId] = useState<string>("shapes");

  const tools: Tool[] = [
    {
      id: "select",
      name: "Select",
      icon: <LofiToolsPanelSelectIcon />,
      color: "#8A3FF8",
    },
    {
      id: "shapes",
      name: "Shapes",
      icon: <LofiToolsPanelShapesIcon />,
      color: "#FF8A65",
    },
    {
      id: "text",
      name: "Text",
      icon: <LofiToolsPanelTextIcon />,
      color: "#4DB6AC",
    },
    {
      id: "draw",
      name: "Draw",
      icon: <LofiToolsPanelDrawIcon />,
      color: "#5C6BC0",
    },
    {
      id: "lines",
      name: "Lines",
      icon: <LofiToolsPanelLinesIcon />,
      color: "#7CB342",
    },
    {
      id: "sticky-notes",
      name: "Sticky Notes",
      icon: <LofiToolsPanelStickyNotesIcon />,
      color: "#FFD54F",
    },
    {
      id: "tables",
      name: "Tables",
      icon: <LofiToolsPanelTablesIcon />,
      color: "#4FC3F7",
    },
  ];

  const handleToolClick = (toolId: string) => {
    setActiveToolId(toolId);
    if (onToolSelect) {
      onToolSelect(toolId);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="lofi-tools-panel"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="lofi-tools-header">
        <button className="lofi-tools-close" onClick={onClose}>
          <LofiToolsPanelCloseIcon />
        </button>
      </div>
      <div className="tools-body">
        <div className="lofi-tools-container">
          {tools.map(tool => (
            <div
              key={tool.id}
              className={`lofi-tool-item ${tool.id === activeToolId ? "active" : ""}`}
              onClick={() => handleToolClick(tool.id)}
              title={tool.name}
            >
              <div className="lofi-tool-icon-container">
                {typeof tool.icon === "string" ? (
                  <img src={tool.icon} alt={tool.name} className="lofi-tool-icon" />
                ) : (
                  <div className="lofi-tool-icon">{tool.icon}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LofiToolsPanel;
