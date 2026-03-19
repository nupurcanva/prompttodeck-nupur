import React from 'react';
import { useChatGPTPreview } from '@/contexts/ChatGPTPreviewContext';
import './style.css';

interface ChatGPTPreviewPanelProps {
  onClose?: () => void;
}

const ChatGPTPreviewPanel: React.FC<ChatGPTPreviewPanelProps> = () => {
  const preview = useChatGPTPreview();
  const { pages, loadedSlideCount, mainPreviewUnblurred, visiblePageSlotsCount = 0, hasData } = preview || {
    pages: [],
    loadedSlideCount: 0,
    mainPreviewUnblurred: false,
    visiblePageSlotsCount: 0,
    hasData: false,
  };

  if (!hasData || pages.length === 0) {
    return null;
  }

  const firstThumb = pages[0]?.thumb;
  const slotsToShow = Math.max(visiblePageSlotsCount, loadedSlideCount >= 1 ? 1 : 0);

  return (
    <div className="chatgpt-preview-panel">
      <div className="chatgpt-preview-area">
        <div className={`chatgpt-preview-gradient-bg ${loadedSlideCount >= 1 ? 'faded' : ''}`} />
        {loadedSlideCount >= 1 && firstThumb && (
          <div className="chatgpt-preview-bg">
            <img
              src={firstThumb}
              alt=""
              className={`chatgpt-preview-bg-img ${mainPreviewUnblurred ? 'unblurred' : ''}`}
            />
          </div>
        )}
        <div className="chatgpt-preview-content" />
      </div>
      <div className="chatgpt-preview-slides-row">
        {pages.slice(0, slotsToShow).map((page, index) => (
          <div key={page.id} className="chatgpt-preview-slide-thumb">
            {index + 2 <= loadedSlideCount ? (
              <img src={page.thumb} alt={page.label} />
            ) : (
              <div className="chatgpt-preview-slide-gradient" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatGPTPreviewPanel;
