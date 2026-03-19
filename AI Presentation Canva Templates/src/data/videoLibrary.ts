/**
 * Video Library Data
 * Contains sample videos available in the Videos side panel
 */

export interface VideoItem {
  id: string;
  name: string;
  videoSrc: string;
  thumbnailUrl: string; // Using video poster or first frame
  duration: number; // Duration in seconds
  category: string;
}

// Sample videos from public/videos folder
export const sampleVideos: VideoItem[] = [
  {
    id: 'beach-video-1',
    name: 'Beach Video 1',
    videoSrc: '/videos/beachVideo1.mp4',
    thumbnailUrl: '/videos/beachVideo1.mp4', // Will use video as thumbnail
    duration: 10,
    category: 'nature',
  },
  {
    id: 'beach-video-2',
    name: 'Beach Video 2',
    videoSrc: '/videos/beachVideo2.mp4',
    thumbnailUrl: '/videos/beachVideo2.mp4',
    duration: 8,
    category: 'nature',
  },
  {
    id: 'computer-video',
    name: 'Computer',
    videoSrc: '/videos/computer.mp4',
    thumbnailUrl: '/videos/computer.mp4',
    duration: 12,
    category: 'tech',
  },
  {
    id: 'plane-video',
    name: 'Plane',
    videoSrc: '/videos/plane.mp4',
    thumbnailUrl: '/videos/plane.mp4',
    duration: 6,
    category: 'travel',
  },
  {
    id: 'travel-video',
    name: 'Travel',
    videoSrc: '/videos/travel.mp4',
    thumbnailUrl: '/videos/travel.mp4',
    duration: 15,
    category: 'travel',
  },
];

// Videos organized by category for the panel sections
export const videosByCategory = {
  trending: [sampleVideos[0], sampleVideos[2]], // beach1, computer
  nature: [sampleVideos[0], sampleVideos[1]], // beach1, beach2
  tech: [sampleVideos[2], sampleVideos[3]], // computer, plane
  travel: [sampleVideos[3], sampleVideos[4]], // plane, travel
  backgrounds: [sampleVideos[1], sampleVideos[4]], // beach2, travel
};

// Helper to format duration as string (e.g., "7.0s")
export const formatDuration = (seconds: number): string => {
  return `${seconds.toFixed(1)}s`;
};
