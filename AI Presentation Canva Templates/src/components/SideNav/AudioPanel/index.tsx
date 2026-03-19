import React from 'react';
import BasicSearchbar from '@components/Objects/BasicSearchbar';
import PrimaryPurpleButton from '@components/Objects/Buttons/PrimaryPurpleButton';
import AudioCategory from '@components/Objects/AudioCategory';
import './style.css';

/**
 * AudioPanel - Side panel for audio library
 * Shows when Audio nav button is clicked in video view
 */
const AudioPanel: React.FC = () => {
  return (
    <div className="audio-panel">
      <div className="audio-panel-content">
        {/* Search bar */}
        <div className="audio-search">
          <BasicSearchbar sampleText="Search audio" />
        </div>

        {/* Record/Upload button */}
        <PrimaryPurpleButton text="Record voiceover" />

        {/* Recently used */}
        <AudioCategory
          title="Recently used"
          track1={{
            id: 'recent1',
            thumbnailUrl: 'https://picsum.photos/seed/audio1/200',
            title: 'Young American Heart',
            artist: 'Benson Boone',
            duration: '1:00',
            isPro: true,
          }}
          track2={{
            id: 'recent2',
            thumbnailUrl: 'https://picsum.photos/seed/audio2/200',
            title: 'Let It Snow! (10th Anniversary)',
            artist: 'Michael Bublé',
            duration: '1:00',
            isPro: true,
          }}
          track3={{
            id: 'recent3',
            thumbnailUrl: 'https://picsum.photos/seed/audio3/200',
            title: '',
            artist: '',
            duration: '1:00',
            isPro: false,
          }}
        />

        {/* Holiday */}
        <AudioCategory
          title="Holiday"
          track1={{
            id: 'holiday1',
            thumbnailUrl: 'https://picsum.photos/seed/holiday1/200',
            title: 'Let It Snow! (10th Anniversary)',
            artist: 'Michael Bublé',
            duration: '1:00',
            isPro: true,
          }}
          track2={{
            id: 'holiday2',
            thumbnailUrl: 'https://picsum.photos/seed/holiday2/200',
            title: 'Joy to the World',
            artist: 'Aretha Franklin',
            duration: '1:00',
            isPro: true,
          }}
          track3={{
            id: 'holiday3',
            thumbnailUrl: 'https://picsum.photos/seed/holiday3/200',
            title: 'Jingle Bell (House Remix)',
            artist: 'Christmas Hits & Christmas & Christmas...',
            duration: '1:00',
            isPro: true,
          }}
        />

        {/* Popular music */}
        <AudioCategory
          title="Popular music"
          track1={{
            id: 'popular1',
            thumbnailUrl: 'https://picsum.photos/seed/popular1/200',
            title: 'Young American Heart',
            artist: 'Benson Boone',
            duration: '1:00',
            isPro: true,
          }}
          track2={{
            id: 'popular2',
            thumbnailUrl: 'https://picsum.photos/seed/popular2/200',
            title: 'If We Make It Through December',
            artist: 'Phoebe Bridgers',
            duration: '1:00',
            isPro: true,
          }}
          track3={{
            id: 'popular3',
            thumbnailUrl: 'https://picsum.photos/seed/popular3/200',
            title: 'Truth Hurts',
            artist: 'Lizzo',
            duration: '1:00',
            isPro: true,
          }}
        />
      </div>
    </div>
  );
};

export default AudioPanel;
