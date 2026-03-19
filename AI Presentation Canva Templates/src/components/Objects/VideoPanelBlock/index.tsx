import React, { useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import SectionHeader from '../SectionHeader';
import styles from './VideoPanelBlock.module.css';
import type { VideoItem } from '@/data/videoLibrary';

interface VideoThumbnail {
  id: string;
  imageUrl?: string;
  videoSrc?: string; // Video source for thumbnail preview
  duration: string; // e.g., "7.0s", "12.0s"
  hasCrown?: boolean; // Premium/pro indicator
  videoData?: VideoItem; // Full video data for drag-and-drop
}

interface VideoPanelBlockProps {
  title: string;
  video1: VideoThumbnail;
  video2: VideoThumbnail;
  onSeeAllClick?: () => void;
}

/**
 * Parse duration string to milliseconds
 * @param durationStr - Duration string like "7.0s"
 * @returns Duration in milliseconds
 */
const parseDuration = (durationStr: string): number => {
  return parseFloat(durationStr) * 1000;
};

/**
 * DraggableVideoThumbnail - A single draggable video thumbnail using @dnd-kit
 * Uses useDraggable hook which connects to the parent DndContext in VideoView
 */
const DraggableVideoThumbnail: React.FC<{ video: VideoThumbnail }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `video-library-${video.id}`,
    data: {
      type: 'video-library-item',
      duration: parseDuration(video.duration),
      videoData: video.videoData,
    },
  });

  // Set video to first frame for thumbnail
  useEffect(() => {
    if (videoRef.current && video.videoSrc) {
      videoRef.current.currentTime = 0.1;
    }
  }, [video.videoSrc]);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${styles.thumbnail} ${isDragging ? styles.dragging : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <div className={styles.thumbnailImage}>
        {/* Video thumbnail using video element */}
        {video.videoSrc ? (
          <video
            ref={videoRef}
            src={video.videoSrc}
            muted
            playsInline
            preload="metadata"
            className={styles.videoPreview}
          />
        ) : video.imageUrl ? (
          <div
            className={styles.imagePreview}
            style={{ backgroundImage: `url(${video.imageUrl})` }}
          />
        ) : null}

        {/* Duration badge */}
        <div className={styles.duration}>{video.duration}</div>

        {/* Crown icon for premium */}
        {video.hasCrown && (
          <div className={styles.crown}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * VideoPanelBlock - Displays a section title with two video thumbnails
 *
 * Used in VideoPanel to show video categories with thumbnail previews
 */
const VideoPanelBlock: React.FC<VideoPanelBlockProps> = ({
  title,
  video1,
  video2,
  onSeeAllClick,
}) => {
  return (
    <div className={styles.videoPanelBlock}>
      {/* Section Header */}
      <SectionHeader title={title} onSeeAllClick={onSeeAllClick} />

      {/* Two Video Thumbnails */}
      <div className={styles.thumbnailGrid}>
        <DraggableVideoThumbnail video={video1} />
        <DraggableVideoThumbnail video={video2} />
      </div>
    </div>
  );
};

export default VideoPanelBlock;
