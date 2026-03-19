import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Canvas from '../../Canvas/Canvas';
import PreviewPanel from '../../Preview/PreviewPanel/index';
import ChatGPTPreviewPanel from '../../Preview/ChatGPTPreviewPanel';
import ToolbarContainer from '../../Toolbar/ToolbarContainer/index';
import { useChatGPTPreview } from '@/contexts/ChatGPTPreviewContext';
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

interface CanvasData {
  id: number;
  content: string;
  color?: string;
  gradient?: GradientConfig;
  elements?: ElementData[];
}

// All white canvas backgrounds
const CANVAS_BACKGROUNDS: Array<Partial<CanvasData>> = [
  { color: '#FFFFFF' },
  { color: '#FFFFFF' },
  { color: '#FFFFFF' },
  { color: '#FFFFFF' },
  { color: '#FFFFFF' },
];

// White color for new canvases
const CANVAS_COLORS: string[] = [
  '#FFFFFF', // White
];

interface MainContainerProps {
  showPreviewPanel?: boolean; // Controls whether preview panel is shown (default: true)
  customCanvasContent?: React.ReactNode; // Optional custom content to render on canvas instead of default
  canvasType?: 'presentation' | 'doc' | 'instagram' | 'tiktok' | 'email'; // Canvas type for aspect ratio
}

const MainContainer: React.FC<MainContainerProps> = ({
  showPreviewPanel = true,
  customCanvasContent,
  canvasType,
}) => {
  const location = useLocation();
  const isVideoView = location.pathname === '/video';
  const [isFromChatGPT, setIsFromChatGPT] = useState(false);
  const chatGPTPreview = useChatGPTPreview();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const stored = localStorage.getItem('canva-from-chatgpt');
      setIsFromChatGPT(params.get('from') === 'chatgpt' && !!stored);
    } catch {
      setIsFromChatGPT(false);
    }
  }, []);

  // When from ChatGPT: show first slide as the main page (thumbnail being created into a page)
  const showSlideAsPage =
    isFromChatGPT &&
    chatGPTPreview?.hasData &&
    chatGPTPreview.pages.length > 0 &&
    chatGPTPreview.loadedSlideCount >= 1;
  const firstSlideThumb = showSlideAsPage ? chatGPTPreview.pages[0].thumb : null;

  const [canvases, setCanvases] = useState<CanvasData[]>([
    {
      id: 1,
      content: 'Slide 1 Content',
      color: '#FFFFFF', // White
      elements: [], // Removed all placeholder elements
    },
    {
      id: 2,
      content: 'Slide 2 Content',
      color: '#FFFFFF', // White
    },
    {
      id: 3,
      content: 'Slide 3 Content',
      color: '#FFFFFF', // White
    },
    {
      id: 4,
      content: 'Slide 4 Content',
      color: '#FFFFFF', // White
    },
    {
      id: 5,
      content: 'Slide 5 Content',
      color: '#FFFFFF', // White
    },
  ]);

  const [activeCanvasId, setActiveCanvasId] = useState<number>(1);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(null);

  // Video timeline state
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineDuration] = useState(60); // 60 seconds default

  // Find the active canvas
  const activeCanvas = canvases.find(canvas => canvas.id === activeCanvasId) || canvases[0];

  const handleCanvasSelect = (canvasId: number): void => {
    setActiveCanvasId(canvasId);
    // When changing canvases, reset selection
    setSelectedElementType(null);
  };

  const handleElementSelect = (elementType: string | null): void => {
    setSelectedElementType(elementType);
  };

  const handleAddCanvas = (): void => {
    // Get highest ID to ensure unique IDs
    const maxId = canvases.reduce((max, canvas) => Math.max(max, canvas.id), 0);
    const newId = maxId + 1;

    // Create new canvas with white background
    const newCanvas: CanvasData = {
      id: newId,
      content: `Slide ${newId} Content`,
      color: '#FFFFFF', // White
    };

    // Add to canvases array
    setCanvases([...canvases, newCanvas]);

    // Automatically select the new canvas
    setActiveCanvasId(newId);
    // Reset element selection
    setSelectedElementType(null);
  };

  // Video timeline handlers
  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  const handleClipSelect = (clip: any) => {
    // Video clip selected
  };

  const handleClipUpdate = (clip: any) => {
    // Video clip updated
  };

  const handleClipDelete = (clipId: string) => {
    // Video clip deleted
  };

  return (
    <div className={`main-container ${isFromChatGPT ? 'from-chatgpt' : ''}`}>
      {selectedElementType && <ToolbarContainer selectedType={selectedElementType} />}
      <div className="main-content-row">
        <div className={`canvas-view-container ${isFromChatGPT ? 'from-chatgpt-canvas' : ''}`}>
          {isFromChatGPT && !showSlideAsPage ? (
            <div className="canvas-waiting-empty" />
          ) : (
            <div className="background-container">
              <Canvas
                id={String(activeCanvas.id)}
                content={activeCanvas.content}
                color={showSlideAsPage ? 'transparent' : activeCanvas.color}
                elements={activeCanvas.elements}
                onSelectElement={handleElementSelect}
                customCanvasContent={
                  showSlideAsPage && firstSlideThumb ? (
                    <img
                      src={firstSlideThumb}
                      alt=""
                      className="canvas-slide-page"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    customCanvasContent
                  )
                }
                canvasType={canvasType}
              />
            </div>
          )}
        </div>
        {isFromChatGPT ? (
          <div className="preview-container chatgpt-preview-at-bottom">
            <ChatGPTPreviewPanel />
          </div>
        ) : showPreviewPanel ? (
          <div className="preview-container">
            <PreviewPanel
              canvases={canvases as never[]}
              activeCanvasId={activeCanvasId}
              onCanvasSelect={handleCanvasSelect}
              onAddCanvas={handleAddCanvas}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MainContainer;
