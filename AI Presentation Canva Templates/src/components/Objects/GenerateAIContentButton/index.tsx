import React from 'react';
import styles from './GenerateAIContentButton.module.css';
import SparkleIcon from './assets/sparkle-icon.svg?react';

interface GenerateAIContentButtonProps {
  text: string;
  showDropdown?: boolean;
  onGenerateClick?: () => void;
  onDropdownClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const GenerateAIContentButton: React.FC<GenerateAIContentButtonProps> = ({
  text,
  showDropdown = false,
  onGenerateClick,
  onDropdownClick,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`${styles.generateAiContentButtonGroup} ${className}`}>
      <button
        className={`${styles.generateAiContentMainButton} ${!showDropdown ? styles.noDropdown : ''}`}
        onClick={onGenerateClick}
        disabled={disabled}
        type="button"
      >
        <div className={styles.generateAiContentIcon}>
          <SparkleIcon />
        </div>
        <span className={styles.generateAiContentText}>{text}</span>
      </button>
      {showDropdown && (
        <button
          className={styles.generateAiContentDropdownButton}
          onClick={onDropdownClick}
          disabled={disabled}
          type="button"
          aria-label="More options"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default GenerateAIContentButton;
