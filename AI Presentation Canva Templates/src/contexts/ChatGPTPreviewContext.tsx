import React, { createContext, useContext, useState, useEffect } from 'react';

interface PageData {
  id: number;
  label: string;
  thumb: string;
}

interface ChatGPTPreviewState {
  pages: PageData[];
  loadedSlideCount: number;
  mainPreviewUnblurred: boolean;
  visiblePageSlotsCount: number;
  hasData: boolean;
}

const DELAY_PURPLE_GRADIENT_MS = 3000;
const DELAY_AFTER_DESIGN_LOAD_MS = 600;
const DELAY_BETWEEN_PAGE_SLOTS_MS = 400;
const DELAY_BETWEEN_THUMBNAILS_MS = 500;

const ChatGPTPreviewContext = createContext<ChatGPTPreviewState | null>(null);

export const ChatGPTPreviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loadedSlideCount, setLoadedSlideCount] = useState(0);
  const [mainPreviewUnblurred, setMainPreviewUnblurred] = useState(false);
  const [visiblePageSlotsCount, setVisiblePageSlotsCount] = useState(0);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('canva-from-chatgpt');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
          setPages(data.pages);
          setHasData(true);
          // Don't restore loading state - always run the loading sequence from scratch
          // so only the first page shows initially, then pages appear one by one
        }
      }
    } catch {
      setHasData(false);
    }
  }, []);

  useEffect(() => {
    if (!hasData || pages.length === 0) return;

    const totalSlides = pages.length;
    let elementTimer: ReturnType<typeof setTimeout> | null = null;
    let slotsIntervalId: ReturnType<typeof setInterval> | null = null;
    let thumbsIntervalId: ReturnType<typeof setInterval> | null = null;
    let slotsStartTimer: ReturnType<typeof setTimeout> | null = null;
    let thumbsStartTimer: ReturnType<typeof setTimeout> | null = null;

    const phase1Timer = setTimeout(() => {
      setLoadedSlideCount(1);
      elementTimer = setTimeout(() => setMainPreviewUnblurred(true), 400);

      slotsStartTimer = setTimeout(() => {
        setVisiblePageSlotsCount(1);
        let slots = 1;
        slotsIntervalId = setInterval(() => {
          slots += 1;
          setVisiblePageSlotsCount((c) => Math.min(c + 1, totalSlides));
          if (slots >= totalSlides && slotsIntervalId) {
            clearInterval(slotsIntervalId);
          }
        }, DELAY_BETWEEN_PAGE_SLOTS_MS);
      }, DELAY_AFTER_DESIGN_LOAD_MS);

      thumbsStartTimer = setTimeout(() => {
        let loaded = 1;
        thumbsIntervalId = setInterval(() => {
          loaded += 1;
          if (loaded > totalSlides + 1) {
            if (thumbsIntervalId) clearInterval(thumbsIntervalId);
            return;
          }
          setLoadedSlideCount(loaded);
        }, DELAY_BETWEEN_THUMBNAILS_MS);
      }, DELAY_AFTER_DESIGN_LOAD_MS + DELAY_BETWEEN_THUMBNAILS_MS);
    }, DELAY_PURPLE_GRADIENT_MS);

    return () => {
      clearTimeout(phase1Timer);
      if (elementTimer) clearTimeout(elementTimer);
      if (slotsStartTimer) clearTimeout(slotsStartTimer);
      if (thumbsStartTimer) clearTimeout(thumbsStartTimer);
      if (slotsIntervalId) clearInterval(slotsIntervalId);
      if (thumbsIntervalId) clearInterval(thumbsIntervalId);
    };
  }, [hasData, pages.length]);

  const value: ChatGPTPreviewState = {
    pages,
    loadedSlideCount,
    mainPreviewUnblurred,
    visiblePageSlotsCount,
    hasData,
  };

  return (
    <ChatGPTPreviewContext.Provider value={value}>{children}</ChatGPTPreviewContext.Provider>
  );
};

export const useChatGPTPreview = (): ChatGPTPreviewState | null => useContext(ChatGPTPreviewContext);
