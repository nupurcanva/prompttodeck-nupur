import React, { useState } from 'react';
import BasicSearchbar from '@components/Objects/BasicSearchbar';
import PrimaryPurpleButton from '@components/Objects/Buttons/PrimaryPurpleButton';
import ScrollableRow from '@components/Objects/ScrollableRow';
import SectionHeader from '@components/Objects/SectionHeader';
import ScrollableItemsRow from '@components/Objects/ScrollableItemsRow';

import VideoPanelBlock from '@components/Objects/VideoPanelBlock';

import './style.css';
import { ItemBase } from '../LofiElementsPanel/exampleData';
import { videosByCategory, formatDuration, type VideoItem } from '@/data/videoLibrary';

/**
 * VideoPanel - Side panel for video library
 * Shows when Videos nav button is clicked in video view
 */

const VideoPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Helper to convert VideoItem to thumbnail props
  const videoToThumbnail = (video: VideoItem, hasCrown = false) => ({
    id: video.id,
    videoSrc: video.videoSrc,
    duration: formatDuration(video.duration),
    hasCrown,
    videoData: video, // Include full data for drag-and-drop
  });

  // Filter/category cards data
  const filterCards: ItemBase[] = [
    { id: 'filter1', title: '' },
    { id: 'filter2', title: '' },
    { id: 'filter3', title: '' },
    { id: 'filter4', title: '' },
  ];

  const apps: ItemBase[] = [
    { id: 'app1', title: 'App 1' },
    { id: 'app2', title: 'App 2' },
    { id: 'app3', title: 'App 3' },
    { id: 'app4', title: 'App 4' },
    { id: 'app5', title: 'App 5' },
  ];

  return (
    <div className="video-panel">
      <div className="video-panel-content">
        {/* Search bar */}
        <div className="video-search">
          <BasicSearchbar sampleText="Search videos" />
        </div>

        {/* Upload/Record button */}
        <PrimaryPurpleButton text="Record yourself" />

        {/* Category filter pills */}
        <div className="lofi-cards-scroll-container">
          <ScrollableRow>
            {filterCards.map(card => (
              <div key={card.id} className="lofi-card-item scroll-item"></div>
            ))}
          </ScrollableRow>
        </div>

        {/* Video categories/sections */}
        <div className="video-categories">
          <VideoPanelBlock
            title="Trending"
            video1={videoToThumbnail(videosByCategory.trending[0], true)}
            video2={videoToThumbnail(videosByCategory.trending[1])}
            onSeeAllClick={() => console.log('See all clicked')}
          />

          <VideoPanelBlock
            title="Nature"
            video1={videoToThumbnail(videosByCategory.nature[0], true)}
            video2={videoToThumbnail(videosByCategory.nature[1])}
            onSeeAllClick={() => console.log('See all clicked')}
          />

          <VideoPanelBlock
            title="Backgrounds"
            video1={videoToThumbnail(videosByCategory.backgrounds[0])}
            video2={videoToThumbnail(videosByCategory.backgrounds[1])}
            onSeeAllClick={() => console.log('See all clicked')}
          />

          <div className="lofi-brand-section">
            <SectionHeader title="Apps" />
            <ScrollableItemsRow items={apps} />
          </div>

          <VideoPanelBlock
            title="Travel"
            video1={videoToThumbnail(videosByCategory.travel[0])}
            video2={videoToThumbnail(videosByCategory.travel[1])}
            onSeeAllClick={() => console.log('See all clicked')}
          />

          <VideoPanelBlock
            title="Tech"
            video1={videoToThumbnail(videosByCategory.tech[0], true)}
            video2={videoToThumbnail(videosByCategory.tech[1])}
            onSeeAllClick={() => console.log('See all clicked')}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
