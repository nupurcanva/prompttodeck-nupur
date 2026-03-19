import React, { useState, useRef, useEffect } from 'react';
import styles from './ArtboardsToolbar.module.css';

import GridIcon from './assets/grid-layout-icon.svg?react';
import VerticalIcon from './assets/vertical-layout-icon.svg?react';
import HorizontalIcon from './assets/horizontal-layout-icon.svg?react';
import BoxButtonIcon from './assets/box-icon.svg?react';
import PlusIcon from './assets/plus-icon.svg?react';

export type LayoutMode = 'grid' | 'vertical' | 'horizontal';

interface ArtboardsToolbarProps {
  layoutMode: LayoutMode;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onSelectAll: () => void;
}

const ArtboardsToolbar: React.FC<ArtboardsToolbarProps> = ({
  layoutMode,
  onLayoutModeChange,
  onSelectAll,
}) => {
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
  const layoutDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(event.target as Node)) {
        setIsLayoutDropdownOpen(false);
      }
    };

    if (isLayoutDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLayoutDropdownOpen]);

  return (
    <div className={styles.artboardToolbar}>
      <button className={styles.artboardToolbarBtn} onClick={onSelectAll}>
        Select all
      </button>
      <button className={styles.artboardToolbarBtn}>
        <BoxButtonIcon />
      </button>
      <button className={styles.artboardToolbarBtn}>
        <GridIcon />
      </button>
      <button className={styles.artboardToolbarBtn}>
        <PlusIcon />
      </button>
      <button className={styles.artboardToolbarBtn}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 7h12M8 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className={styles.artboardToolbarDivider} />
      <div className={styles.artboardLayoutDropdown} ref={layoutDropdownRef}>
        <button
          className={`${styles.artboardToolbarBtn} ${styles.autoLayoutBtn}`}
          onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
        >
          {layoutMode === 'grid' && <GridIcon />}
          {layoutMode === 'vertical' && <VerticalIcon />}
          {layoutMode === 'horizontal' && <HorizontalIcon />}
          <span>
            {layoutMode === 'grid' && 'Auto layout'}
            {layoutMode === 'vertical' && 'Vertical layout'}
            {layoutMode === 'horizontal' && 'Horizontal layout'}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {isLayoutDropdownOpen && (
          <div className={styles.artboardLayoutDropdownMenu}>
            <button
              className={`${styles.layoutOption} ${layoutMode === 'grid' ? styles.active : ''}`}
              onClick={() => {
                onLayoutModeChange('grid');
                setIsLayoutDropdownOpen(false);
              }}
            >
              <GridIcon />
              <div className={styles.layoutOptionLabel}>
                <div className={styles.layoutOptionTitle}>Auto layout</div>
                <div className={styles.layoutOptionDescription}>Grid arrangement</div>
              </div>
            </button>

            <button
              className={`${styles.layoutOption} ${layoutMode === 'vertical' ? styles.active : ''}`}
              onClick={() => {
                onLayoutModeChange('vertical');
                setIsLayoutDropdownOpen(false);
              }}
            >
              <VerticalIcon />
              <div className={styles.layoutOptionLabel}>
                <div className={styles.layoutOptionTitle}>Vertical layout</div>
                <div className={styles.layoutOptionDescription}>Stacked vertically</div>
              </div>
            </button>

            <button
              className={`${styles.layoutOption} ${layoutMode === 'horizontal' ? styles.active : ''}`}
              onClick={() => {
                onLayoutModeChange('horizontal');
                setIsLayoutDropdownOpen(false);
              }}
            >
              <HorizontalIcon />
              <div className={styles.layoutOptionLabel}>
                <div className={styles.layoutOptionTitle}>Horizontal layout</div>
                <div className={styles.layoutOptionDescription}>Side by side</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtboardsToolbar;
