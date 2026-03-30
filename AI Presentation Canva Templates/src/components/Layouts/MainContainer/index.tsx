import React, { useState, useEffect } from 'react';
import Canvas from '../../Canvas/Canvas';
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

interface MainContainerProps {
  customCanvasContent?: React.ReactNode;
  canvasType?: 'presentation' | 'doc' | 'instagram' | 'tiktok' | 'email';
}

const MainContainer: React.FC<MainContainerProps> = ({
  customCanvasContent,
  canvasType,
}) => {
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

  const showSlideAsPage =
    isFromChatGPT &&
    chatGPTPreview?.hasData &&
    chatGPTPreview.pages.length > 0 &&
    chatGPTPreview.loadedSlideCount >= 1;
  const firstSlideThumb = showSlideAsPage ? chatGPTPreview.pages[0].thumb : null;

  const [canvases] = useState<CanvasData[]>([
    {
      id: 1,
      content: 'Slide 1 Content',
      color: '#FFFFFF',
      elements: [],
    },
    {
      id: 2,
      content: 'Slide 2 Content',
      color: '#FFFFFF',
    },
    {
      id: 3,
      content: 'Slide 3 Content',
      color: '#FFFFFF',
    },
    {
      id: 4,
      content: 'Slide 4 Content',
      color: '#FFFFFF',
    },
    {
      id: 5,
      content: 'Slide 5 Content',
      color: '#FFFFFF',
    },
  ]);

  const [activeCanvasId] = useState<number>(1);
  const [selectedElementType, setSelectedElementType] = useState<string | null>(null);

  const activeCanvas = canvases.find(canvas => canvas.id === activeCanvasId) || canvases[0];

  const handleElementSelect = (elementType: string | null): void => {
    setSelectedElementType(elementType);
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
        ) : null}
      </div>
    </div>
  );
};

export default MainContainer;
