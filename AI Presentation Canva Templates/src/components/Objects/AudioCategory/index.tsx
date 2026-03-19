import React from 'react';
import SectionHeader from '../SectionHeader';
import AudioTrack from '../AudioTrack';
import styles from './AudioCategory.module.css';

interface AudioTrackData {
  id: string;
  thumbnailUrl: string;
  title: string;
  artist: string;
  duration: string;
  isPro: boolean;
}

interface AudioCategoryProps {
  title: string;
  track1: AudioTrackData;
  track2: AudioTrackData;
  track3: AudioTrackData;
  onSeeAllClick?: () => void;
}

/**
 * AudioCategory - Displays a category section with 3 audio tracks
 * 
 * Used in AudioPanel to organize audio by category (Holiday, Popular, etc.)
 */
const AudioCategory: React.FC<AudioCategoryProps> = ({
  title,
  track1,
  track2,
  track3,
  onSeeAllClick,
}) => {
  return (
    <div className={styles.audioCategory}>
      {/* Section Header */}
      <SectionHeader title={title} onSeeAllClick={onSeeAllClick} />

      {/* Audio Tracks */}
      <div className={styles.trackList}>
        <AudioTrack {...track1} />
        <AudioTrack {...track2} />
        <AudioTrack {...track3} />
      </div>
    </div>
  );
};

export default AudioCategory;

