import React from 'react';
import styles from './PrimaryPurpleButton.module.css';

interface PrimaryPurpleButtonProps {
  text: string;
  onClick?: () => void;
}

/**
 * PrimaryPurpleButton - Reusable purple primary button
 *
 * Used across side panels (Text, Audio, Video, etc.)
 */
const PrimaryPurpleButton: React.FC<PrimaryPurpleButtonProps> = ({ text, onClick }) => {
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default PrimaryPurpleButton;
