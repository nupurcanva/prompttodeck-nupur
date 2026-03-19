import React from 'react';
import styles from './BasicSearchbar.module.css';

interface BasicSearchbarProps {
  /** Sample text to show when input is empty */
  sampleText?: string;
  /** Alternative prop name for backward compatibility */
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  /** Extended mode with voice and arrow buttons */
  extended?: boolean;
  /** Callback for voice search button */
  onVoiceSearch?: () => void;
}

const BasicSearchbar: React.FC<BasicSearchbarProps> = ({
  sampleText,
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  className = '',
  disabled = false,
  extended = false,
  onVoiceSearch,
}) => {
  // Use sampleText if provided, otherwise fall back to placeholder
  const displayText = sampleText || placeholder;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && value) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit && value) {
      onSubmit(value);
    }
  };

  const handleVoiceClick = () => {
    if (onVoiceSearch) {
      onVoiceSearch();
    }
  };

  const handleArrowClick = () => {
    if (onSubmit && value) {
      onSubmit(value);
    }
  };

  return (
    <div className={`${styles.basicSearchContainer} ${extended ? styles.extended : ''} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.basicSearchForm}>
        <div className={styles.basicSearchBar}>
          {!extended && (
            <div className={styles.basicSearchIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14L11 11"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          <input
            type="text"
            placeholder={displayText}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={styles.basicSearchInput}
          />
          {extended && (
            <div className={styles.basicSearchActions}>
              <button
                type="button"
                className={`${styles.basicSearchActionBtn} ${styles.voiceBtn}`}
                onClick={handleVoiceClick}
                aria-label="Voice search"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10V5C12.5 3.61929 11.3807 2.5 10 2.5C8.61929 2.5 7.5 3.61929 7.5 5V10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 9V10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 15V17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.basicSearchActionBtn} ${styles.arrowBtn}`}
                onClick={handleArrowClick}
                aria-label="Search"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BasicSearchbar;
