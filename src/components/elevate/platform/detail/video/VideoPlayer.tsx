import { useEffect, useRef } from 'react';
import { useYouTubePlayer } from './useYouTubePlayer';
import { CONTAINER_STYLES } from './VideoPlayerConfig';

interface VideoPlayerProps {
  videoUrl: string;
  onProgress?: (progress: number) => void;
  savedProgress?: number;
  onDuration?: (duration: number) => void;
}

export const VideoPlayer = ({ 
  videoUrl, 
  onProgress, 
  savedProgress,
  onDuration 
}: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAPILoaded, initializePlayer } = useYouTubePlayer({
    videoUrl,
    onProgress,
    savedProgress,
    onDuration
  });

  useEffect(() => {
    if (isAPILoaded && containerRef.current) {
      initializePlayer(containerRef.current);
    }
  }, [isAPILoaded, videoUrl, initializePlayer]);

  if (!videoUrl) return null;

  return (
    <div 
      ref={containerRef} 
      style={CONTAINER_STYLES}
      className="rounded-lg overflow-hidden bg-black/5"
    />
  );
};