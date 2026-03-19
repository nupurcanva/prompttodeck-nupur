import React, { useState, useRef, useEffect } from 'react';
import LeftArrowIcon from '../../SideNav/LofiElementsPanel/assets/left-arrow.svg?react';
import RightArrowIcon from '../../SideNav/LofiElementsPanel/assets/right-arrow.svg?react';
import styles from './ScrollableRow.module.css';

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ScrollableRow - Reusable horizontal scrolling container with fade effects and navigation arrows
 *
 * Used in side panels (Elements, Audio, Video, etc.) for scrollable content rows
 */
const ScrollableRow: React.FC<ScrollableRowProps> = ({ children, className = '' }) => {
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
          <LeftArrowIcon />
        </div>
      </div>
      <div className={`${styles.horizontalScroll} ${className}`} ref={scrollRef}>
        {children}
      </div>
      <div className={`${styles.fadeRight} ${showRightFade ? styles.visible : styles.hidden}`}>
        <div className={styles.scrollArrow} onClick={handleScrollRight}>
          <RightArrowIcon />
        </div>
      </div>
    </div>
  );
};

export default ScrollableRow;
