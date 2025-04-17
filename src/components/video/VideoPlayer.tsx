
import React, { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/context/AppContext';

interface VideoPlayerProps {
  videoResolution: 'short' | 'regular';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoResolution }) => {
  const { currentProject } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (videoRef.current && currentProject.finalVideoUrl) {
      const videoElement = videoRef.current;
      
      // Reset video element
      videoElement.pause();
      videoElement.currentTime = 0;
      
      // Set up event listeners
      const handleError = () => {
        console.error('Video failed to load:', currentProject.finalVideoUrl);
        toast({
          title: "Video playback issue",
          description: "There was a problem playing this video. Please try regenerating.",
          variant: "destructive",
        });
      };
      
      const handleCanPlay = () => {
        console.log('Video can play:', currentProject.finalVideoUrl);
      };
      
      // Add event listeners
      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('canplay', handleCanPlay);
      
      // Set video source
      videoElement.src = currentProject.finalVideoUrl;
      videoElement.load();
      
      // Clean up
      return () => {
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [currentProject.finalVideoUrl, toast]);

  return (
    <div className={`aspect-${videoResolution === 'short' ? '9/16' : 'video'} bg-black rounded-lg overflow-hidden mx-auto ${videoResolution === 'short' ? 'max-w-[400px]' : 'w-full'}`}>
      <video 
        ref={videoRef}
        src={currentProject.finalVideoUrl} 
        controls
        poster={currentProject.selectedMedia[0]?.thumbnailUrl}
        className="w-full h-full"
        playsInline
        preload="auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
