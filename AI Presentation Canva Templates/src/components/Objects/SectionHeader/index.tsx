import React from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  onSeeAllClick?: () => void;
  showSeeAll?: boolean;
}

/**
 * SectionHeader - Reusable section header with title and optional "See all" link
 *
 * Used across side panels (Brand, Audio, Video, etc.)
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onSeeAllClick,
  showSeeAll = true,
}) => {
  return (
    <div className={styles.sectionHeader}>
      <h3>{title}</h3>
      {showSeeAll && (
        <a
          href="#"
          className={styles.seeAll}
          onClick={e => {
            e.preventDefault();
            if (onSeeAllClick) onSeeAllClick();
          }}
        >
          See all
        </a>
      )}
    </div>
  );
};

export default SectionHeader;
