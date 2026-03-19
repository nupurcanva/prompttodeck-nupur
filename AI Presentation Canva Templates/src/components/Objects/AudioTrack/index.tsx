import React from 'react';
import styles from './AudioTrack.module.css';

interface AudioTrackProps {
  thumbnailUrl: string;
  title: string;
  artist: string;
  duration: string; // e.g., "1:00", "2:30"
  isPro: boolean;
  onClick?: () => void;
}

/**
 * AudioTrack - Displays an audio track with thumbnail, title, artist, and duration
 * 
 * Used in AudioPanel to show audio library items
 */
const AudioTrack: React.FC<AudioTrackProps> = ({
  thumbnailUrl,
  title,
  artist,
  duration,
  isPro,
  onClick,
}) => {
  return (
    <div className={styles.audioTrack} onClick={onClick}>
      {/* Play button with thumbnail */}
      <div className={styles.thumbnail}>
        <div 
          className={styles.thumbnailImage}
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
        >
          {/* Play icon overlay */}
          <div className={styles.playIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div className={styles.durationBadge}>{duration}</div>
      </div>

      {/* Track info */}
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist} • {duration}</div>
        
        {/* Audio waveform visualization */}
        <div className={styles.waveform}>
          <svg width="100%" height="24" viewBox="0 0 200 24" preserveAspectRatio="none">
            {/* Generate waveform bars */}
            {Array.from({ length: 40 }).map((_, i) => {
              const height = Math.random() * 16 + 4; // Random height 4-20px
              const y = (24 - height) / 2; // Center vertically
              return (
                <rect
                  key={i}
                  x={i * 5}
                  y={y}
                  width="3"
                  height={height}
                  fill="#8B5CF6"
                  opacity="0.6"
                  rx="1.5"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Pro/Crown indicator */}
      {isPro && (
        <div className={styles.crown}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default AudioTrack;

