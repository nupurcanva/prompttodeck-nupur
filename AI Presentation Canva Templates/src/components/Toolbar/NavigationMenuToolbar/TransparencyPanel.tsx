import React from "react";
import { useNavMenuStyleStore } from "../../../stores/navMenuStyle";
import "./TransparencyPanel.css";

const TransparencyPanel: React.FC = () => {
  const { getEffectiveTransparency, setTransparency } = useNavMenuStyleStore();

  // Get effective transparency
  const transparency = getEffectiveTransparency();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransparency(Number(e.target.value));
  };

  return (
    <div className="transparency-panel">
      <h3 className="panel-title">Transparency</h3>
      <div className="slider-container">
        <div className="slider-track">
          <input
            type="range"
            min="0"
            max="100"
            value={transparency}
            onChange={handleSliderChange}
            className="transparency-slider"
          />
        </div>
        <div className="slider-value">{transparency}</div>
      </div>
    </div>
  );
};

export default TransparencyPanel;
