import React from "react";
import "./ColourPanel.css";

type ColorSwatch = {
  id: string;
  color: string;
};

const DOCUMENT_COLORS: ColorSwatch[] = [
  { id: "doc-black", color: "#000000" },
  { id: "doc-white", color: "#FFFFFF" },
  { id: "doc-beige", color: "#D7C0A1" },
  { id: "doc-brown", color: "#6D4C41" },
  { id: "doc-gray", color: "#E0E0E0" },
];

const SOLID_COLORS: ColorSwatch[] = [
  { id: "black", color: "#000000" },
  { id: "gray-dark", color: "#424242" },
  { id: "gray-medium", color: "#9E9E9E" },
  { id: "gray-light", color: "#E0E0E0" },
  { id: "gray-lightest", color: "#F5F5F5" },
  { id: "white", color: "#FFFFFF" },
  { id: "green", color: "#00E676" },
  { id: "lime", color: "#C6FF00" },
  { id: "yellow", color: "#FFEA00" },
  { id: "cyan", color: "#18FFFF" },
  { id: "blue-light", color: "#40C4FF" },
  { id: "blue", color: "#2979FF" },
  { id: "blue-dark", color: "#0D47A1" },
  { id: "indigo", color: "#3D5AFE" },
  { id: "purple", color: "#AA00FF" },
  { id: "magenta", color: "#EA80FC" },
  { id: "pink", color: "#FF4081" },
  { id: "red-light", color: "#FF5252" },
  { id: "red", color: "#FF1744" },
  { id: "orange", color: "#FF9100" },
  { id: "yellow-light", color: "#FFD600" },
  { id: "orange-light", color: "#FFAB40" },
];

interface ColourPanelProps {
  onSelectColor: (color: string) => void;
}

const ColourPanel: React.FC<ColourPanelProps> = ({ onSelectColor }) => {
  return (
    <div className="colour-panel">
      <h3 className="panel-title">Document colours</h3>
      <div className="colour-swatches document-colours">
        {DOCUMENT_COLORS.map(swatch => (
          <div
            key={swatch.id}
            className="colour-swatch"
            style={{ backgroundColor: swatch.color }}
            onClick={() => onSelectColor(swatch.color)}
          />
        ))}
      </div>

      <h3 className="panel-subtitle">Solid colours</h3>
      <div className="colour-swatches solid-colours">
        {SOLID_COLORS.map(swatch => (
          <div
            key={swatch.id}
            className="colour-swatch"
            style={{ backgroundColor: swatch.color }}
            onClick={() => onSelectColor(swatch.color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColourPanel;
