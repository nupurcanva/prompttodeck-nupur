import React from "react";
import { useNavMenuStyleStore } from "../../../stores/navMenuStyle";
import "./style.css";

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

const BRAND_COLORS: ColorSwatch[] = [
  { id: "brand-black", color: "#000000" },
  { id: "brand-gray", color: "#9E9E9E" },
  { id: "brand-brown", color: "#6D4C41" },
  { id: "brand-white", color: "#FFFFFF" },
];

const GRADIENT_COLORS: ColorSwatch[] = [
  { id: "gradient-1", color: "linear-gradient(to right, #000000, #424242)" },
  { id: "gradient-2", color: "linear-gradient(to right, #6D4C41, #D7C0A1)" },
  { id: "gradient-3", color: "linear-gradient(to right, #0D47A1, #40C4FF)" },
  { id: "gradient-4", color: "linear-gradient(to right, #FFFFFF, #E0E0E0)" },
  { id: "gradient-5", color: "linear-gradient(to right, #FF1744, #FF80AB)" },
  { id: "gradient-6", color: "linear-gradient(to right, #00E676, #C6FF00)" },
];

const ColourSidebarPanel: React.FC = () => {
  const { getEffectiveMenuBgColor, setMenuBgColor, hideColourPanel } = useNavMenuStyleStore();

  // Get effective menu background color
  const currentMenuBgColor = getEffectiveMenuBgColor();

  const handleColorSelect = (color: string) => {
    setMenuBgColor(color);
    hideColourPanel(); // Close the panel after selection
  };

  return (
    <div className="colour-sidebar-panel">
      <div className="colour-sidebar-header">
        <h2>Menu Background Color</h2>
        <button className="close-button" onClick={hideColourPanel}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#333"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="colour-search-container">
        <div className="colour-search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
          >
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input type="text" placeholder='Try "blue" or "#00c4cc"' />
        </div>
      </div>

      <div className="colour-sidebar-content">
        <div className="colour-section">
          <h3 className="section-title">Document colours</h3>
          <div className="colour-swatches document-colours">
            {DOCUMENT_COLORS.map(swatch => (
              <div
                key={swatch.id}
                className="colour-swatch"
                style={{ backgroundColor: swatch.color }}
                onClick={() => handleColorSelect(swatch.color)}
              />
            ))}
            <div className="colour-swatch add-colour-swatch">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="colour-section">
          <h3 className="section-title">
            Modadane brand kit <span className="expand-icon">▼</span>
          </h3>
          <div className="colour-swatches brand-colours">
            {BRAND_COLORS.map(swatch => (
              <div
                key={swatch.id}
                className="colour-swatch"
                style={{ backgroundColor: swatch.color }}
                onClick={() => handleColorSelect(swatch.color)}
              />
            ))}
            <div className="colour-swatch add-colour-swatch">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="colour-section">
          <h3 className="section-title">Default colours</h3>
          <div className="colour-swatches solid-colours">
            {SOLID_COLORS.map(swatch => (
              <div
                key={swatch.id}
                className="colour-swatch"
                style={{ backgroundColor: swatch.color }}
                onClick={() => handleColorSelect(swatch.color)}
              />
            ))}
          </div>
        </div>

        <div className="colour-section">
          <h3 className="section-title">Gradients</h3>
          <div className="colour-swatches gradient-colours">
            {GRADIENT_COLORS.map(swatch => (
              <div
                key={swatch.id}
                className="colour-swatch"
                style={{ background: swatch.color }}
                onClick={() => handleColorSelect(swatch.color)}
              />
            ))}
          </div>
        </div>

        <div className="colour-section add-color-section">
          <button className="add-color-button">
            <div className="add-icon">+</div>
            <span>Add a new colour</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColourSidebarPanel;
