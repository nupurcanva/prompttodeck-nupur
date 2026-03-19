import React, { useState, useRef, useEffect } from 'react';
import CanvasElement from '../CanvasElement';
// import styles from './Canvas.module.css';
import './style.css';

interface GradientConfig {
  type: 'linear' | 'circular' | 'radial';
  angle?: string;
  position?: string;
  colors: string[];
}

interface ElementData {
  type: 'image' | 'shape' | 'text' | 'video';
  style?: React.CSSProperties;
}

interface CanvasProps {
  id: string;
  content?: string;
  color?: string;
  gradient?: GradientConfig | null;
  elements?: ElementData[];
  onSelectElement?: (type: string | null) => void;
  customCanvasContent?: React.ReactNode; // Optional custom content to render instead of default
  canvasType?: 'presentation' | 'doc' | 'instagram' | 'tiktok' | 'email'; // Canvas type for aspect ratio
}

const Canvas: React.FC<CanvasProps> = ({
  id,
  content = '',
  color = 'white',
  gradient = null,
  elements = [],
  onSelectElement,
  customCanvasContent,
  canvasType,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add document-level click listener to detect clicks outside the canvas
    const handleDocumentClick = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
        setIsSelected(false);
        setSelectedElementId(null);
        // Notify parent that nothing is selected
        if (onSelectElement) {
          onSelectElement(null);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [onSelectElement]);

  const handleCanvasClick = (event: React.MouseEvent) => {
    // Only handle clicks directly on the canvas (not on elements)
    if (
      event.target === canvasRef.current ||
      (event.target as HTMLElement).classList.contains('canvas-content')
    ) {
      setIsSelected(true);
      setSelectedElementId(null);
      // Remove hover class when selected
      setIsHovering(false);

      // Notify parent that canvas is selected
      if (onSelectElement) {
        onSelectElement('canvas');
      }

      // Prevent click from bubbling to document
      event.stopPropagation();
    }
  };

  const handleMouseEnter = () => {
    if (!isSelected) {
      setIsHovering(true);
    } else {
      console
        .log
        // "Mouse entered the canvas - already selected, not adding hover"
        ();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleElementClick = (event: React.MouseEvent, type: string, index: number) => {
    event.stopPropagation();

    // Set this element as selected
    setSelectedElementId(index);

    // Canvas itself is not selected when an element is clicked
    setIsSelected(false);

    // Notify parent that an element is selected
    if (onSelectElement) {
      onSelectElement(type);
    }
  };

  // Get background style based on whether it's a gradient or solid color
  const getBackgroundStyle = (): React.CSSProperties => {
    if (gradient) {
      // If it's a gradient, use the appropriate CSS
      if (gradient.type === 'linear') {
        return {
          background: `linear-gradient(${gradient.angle || '90deg'}, ${gradient.colors.join(
            ', ',
          )})`,
        };
      } else if (gradient.type === 'circular' || gradient.type === 'radial') {
        return {
          background: `radial-gradient(circle at ${
            gradient.position || 'center'
          }, ${gradient.colors.join(', ')})`,
        };
      }
    }

    // Default to solid color
    return { backgroundColor: color };
  };

  // Build class name based on state and canvas type
  const getCanvasTypeClass = () => {
    if (!canvasType) return '';
    if (canvasType === 'instagram') return 'canvasInstagram';
    if (canvasType === 'tiktok') return 'canvasTiktok';
    return '';
  };

  const canvasClassName = `${'canvasContainer'} ${getCanvasTypeClass()} ${
    isSelected ? 'selected' : ''
  } ${isHovering ? 'hover' : ''}`;

  return (
    <div
      ref={canvasRef}
      className={canvasClassName}
      onClick={handleCanvasClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', ...getBackgroundStyle() }}
    >
      {customCanvasContent ? (
        // Render custom content if provided
        <div className={`${'canvasContent'} ${'customCanvasContent'}`}>{customCanvasContent}</div>
      ) : elements && elements.length > 0 ? (
        // Render elements if no custom content
        elements.map((element, index) => (
          <CanvasElement
            key={`${id}-element-${index}`}
            type={element.type}
            style={element.style}
            onClick={e => handleElementClick(e, element.type, index)}
            isSelected={selectedElementId === index}
          />
        ))
      ) : (
        // Empty canvas
        <div className={`${'canvasContent'}`}>{/* Empty canvas */}</div>
      )}
    </div>
  );
};

export default Canvas;
