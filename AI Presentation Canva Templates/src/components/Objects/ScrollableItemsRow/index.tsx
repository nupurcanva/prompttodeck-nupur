import React, { useState, useRef, useEffect } from 'react';
import styles from './ScrollableItemsRow.module.css';

interface BrandItem {
  id: number;
  name: string;
}

interface ScrollableItemsRowProps {
  items: BrandItem[];
  className?: string;
}

/**
 * ScrollableItemsRow - Horizontal scrollable row for brand/media items
 * 
 * Used for logos, colors, fonts, videos, etc. in side panels
 * Includes fade effects and arrow navigation
 */
const ScrollableItemsRow: React.FC<ScrollableItemsRowProps> = ({ items, className = '' }) => {
  const [showLeftFade, setShowLeftFade] = useState<boolean>(false);
  const [showRightFade, setShowRightFade] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Show left fade only if scrolled to the right
      setShowLeftFade(scrollLeft > 0);

      // Show right fade only if there's more content to scroll to
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      checkScroll();
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <div className={styles.scrollableContainer}>
      <div className={`${styles.fadeLeft} ${showLeftFade ? styles.visible : styles.hidden}`}>
        <div className={styles.scrollArrowLeft} onClick={handleScrollLeft}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className={`${styles.scrollableRow} ${className}`} ref={scrollRef}>
        {items.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemContent}></div>
          </div>
        ))}
      </div>
      <div className={`${styles.fadeRight} ${showRightFade ? styles.visible : styles.hidden}`}>
        <div className={styles.scrollArrow} onClick={handleScrollRight}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ScrollableItemsRow;

