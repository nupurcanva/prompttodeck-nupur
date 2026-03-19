import React from "react";
import ToolbarButton from "../ToolbarButton";
import { useNavMenuStyleStore } from "../../../stores/navMenuStyle";
// import TransparencyPanel from "./TransparencyPanel";
import ColourPanel from "./ColourPanel";
import "./style.css";

import EditButton from "@assets/icons/toolbars/navigation-menu-toolbar/edit-button.svg?react";
import ColorButton from "@assets/icons/toolbars/navigation-menu-toolbar/color-button.svg?react";
import BorderButton from "@assets/icons/toolbars/navigation-menu-toolbar/border-button.svg?react";
import FontFamilyButton from "@assets/icons/toolbars/navigation-menu-toolbar/font-family-button.svg?react";
import FontSizeButton from "@assets/icons/toolbars/navigation-menu-toolbar/font-size-button.svg?react";
import TextColorButton from "@assets/icons/toolbars/navigation-menu-toolbar/text-color-button.svg?react";
import UppercaseButton from "@assets/icons/toolbars/navigation-menu-toolbar/uppercase-button.svg?react";
import ParagraphLeftButton from "@assets/icons/toolbars/navigation-menu-toolbar/paragraph-left-button.svg?react";
import ParagraphMiddleButton from "@assets/icons/toolbars/navigation-menu-toolbar/paragraph-middle-button.svg?react";
import ParagraphButton from "@assets/icons/toolbars/navigation-menu-toolbar/paragraph-button.svg?react";
import TransparencyButton from "@assets/icons/toolbars/navigation-menu-toolbar/transparency-button.svg?react";
import CopyStyleButton from "@assets/icons/toolbars/navigation-menu-toolbar/copystyle-button.svg?react";

const NavigationMenuToolbar: React.FC = () => {
  const {
    getEffectiveIsUppercase,
    getEffectiveTextAlignment,
    toggleCase,
    cycleAlignment,
    isTransparencyPanelOpen,
    toggleTransparencyPanel,
    isColourPanelOpen,
    toggleColourPanel,
    showColourPanelInSidebar,
    setMenuBgColor,
    showEditPanelInSidebar,
  } = useNavMenuStyleStore();

  // Get effective styles
  const isUppercase = getEffectiveIsUppercase();
  const textAlignment = getEffectiveTextAlignment();

  const getAlignmentIcon = () => {
    switch (textAlignment) {
      case "flex-start":
        return <ParagraphLeftButton />;
      case "center":
        return <ParagraphMiddleButton />;
      case "flex-end":
        return <ParagraphButton />;
      default:
        return <ParagraphButton />;
    }
  };

  const getAlignmentLabel = () => {
    switch (textAlignment) {
      case "flex-start":
        return "Left";
      case "center":
        return "Center";
      case "flex-end":
        return "Right";
      default:
        return "Right";
    }
  };

  const handleColorSelect = (color: string) => {
    setMenuBgColor(color);
    toggleColourPanel(); // Close the panel after selection
  };

  return (
    <div className="toolbar shape-toolbar" style={{ gap: "4px" }}>
      <ToolbarButton
        icon={<EditButton />}
        label="Edit"
        onClick={showEditPanelInSidebar}
        width={76}
      />

      <div className="colour-button-container">
        <ToolbarButton
          icon={<ColorButton />}
          label="Color"
          onClick={showColourPanelInSidebar}
          isActive={isColourPanelOpen}
        />
        {isColourPanelOpen && <ColourPanel onSelectColor={handleColorSelect} />}
      </div>

      <ToolbarButton
        icon={<BorderButton />}
        label="Border"
        onClick={() => {
          /* Border functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>

      {/* Font Section */}
      <ToolbarButton
        icon={<FontFamilyButton />}
        label="Font Family"
        onClick={() => {
          /* Font family functionality placeholder */
        }}
        width={136}
      />

      <ToolbarButton
        icon={<FontSizeButton />}
        label="Font Size"
        onClick={() => {
          /* Font size functionality placeholder */
        }}
        width={104}
      />

      <ToolbarButton
        icon={<TextColorButton />}
        label="Text Color"
        onClick={() => {
          /* Text color functionality placeholder */
        }}
      />

      <ToolbarButton
        icon={<UppercaseButton />}
        label="AA"
        onClick={() => {
          /* Case toggle functionality disabled for website navigation */
        }}
        isActive={false}
        width={40}
      />

      <ToolbarButton
        icon={getAlignmentIcon()}
        label={getAlignmentLabel()}
        onClick={cycleAlignment}
        width={40}
      />

      <div className="toolbar-divider"></div>

      <div className="transparency-button-container">
        <ToolbarButton
          icon={<TransparencyButton />}
          label="Transparency"
          onClick={() => {
            /* Transparency functionality disabled for website navigation */
          }}
          isActive={false}
        />
      </div>

      <div className="toolbar-divider"></div>

      <ToolbarButton
        icon={<CopyStyleButton />}
        label="Copy Style"
        onClick={() => {
          /* Copy style functionality placeholder */
        }}
      />
    </div>
  );
};

export default NavigationMenuToolbar;
