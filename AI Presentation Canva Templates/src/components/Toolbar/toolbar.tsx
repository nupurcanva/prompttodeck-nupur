import React from 'react';
import ToolbarButton from './ToolbarButton';
import { getButton, type ToolbarConfig } from './toolbarConfig';
import './style.css';

export interface DynamicToolbarProps {
  /** Toolbar configuration (array of button names or 'divider') */
  config: ToolbarConfig;

  /** Additional CSS class name */
  className?: string;

  /** Custom button click handler */
  onButtonClick?: (buttonName: string) => void;

  /** Custom button widths (overrides default widths) */
  buttonWidths?: Record<string, number>;

  /** Gap between toolbar items */
  gap?: string | number;
}

/**
 * DynamicToolbar
 *
 * Renders a toolbar dynamically based on a configuration array.
 * Automatically handles button rendering and dividers.
 *
 * @example
 * ```tsx
 * <DynamicToolbar
 *   config={TEXT_TOOLBAR_CONFIG}
 *   onButtonClick={(name) => console.log(`Clicked ${name}`)}
 * />
 * ```
 */
const DynamicToolbar: React.FC<DynamicToolbarProps> = ({
  config,
  className = '',
  onButtonClick,
  buttonWidths = {},
  gap = '4px',
}) => {
  return (
    <div className={`toolbar ${className}`} style={{ gap }}>
      {config.map((item, index) => {
        // Render divider
        if (item === 'divider') {
          return <div key={`divider-${index}`} className="toolbarDivider" />;
        }

        // Get button definition
        const buttonDef = getButton(item);

        // Skip if button definition not found
        if (!buttonDef) {
          console.warn(`DynamicToolbar: Button "${item}" not found in registry`);
          return null;
        }

        // Determine button width (custom > config > undefined)
        const width = buttonWidths[item] ?? buttonDef.width;

        // Get the Icon component
        const IconComponent = buttonDef.icon;

        // Render button
        return (
          <ToolbarButton
            key={`button-${item}-${index}`}
            icon={<IconComponent />}
            label={buttonDef.label}
            onClick={() => {
              // Call custom handler if provided
              if (onButtonClick) {
                onButtonClick(item);
              }
              // Call default handler if provided
              else if (buttonDef.onClick) {
                buttonDef.onClick();
              }
            }}
            width={width}
          />
        );
      })}
    </div>
  );
};

export default DynamicToolbar;
