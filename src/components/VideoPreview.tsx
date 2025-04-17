
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { useVideoAssembly } from '@/hooks/useVideoAssembly';
import { ArrowLeft, Download, RefreshCw, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VideoPreview: React.FC = () => {
  const { currentProject, updateProject, setCurrentStep, resetProject } = useApp();
  const { startAssembly, progress, isProcessing, videoResolution } = useVideoAssembly();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // When component mounts or video URL changes, try to load the video
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

  const handleAssembleVideo = async () => {
    await startAssembly();
  };

  const handleDownload = () => {
    if (currentProject.driveDownloadUrl) {
      // Create an invisible link and trigger download
      const a = document.createElement('a');
      a.href = currentProject.driveDownloadUrl;
      a.download = `TrendFinder-${currentProject.topic?.title || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your video is being downloaded.",
      });
    } else {
      toast({
        title: "Download failed",
        description: "Video URL is not available. Please try regenerating the video.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep('media');
  };

  const handleNewProject = () => {
    resetProject();
    setCurrentStep('topic');
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="text-center space-y-6">
          <h3 className="text-xl font-medium">Assembling Your Video</h3>
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-muted-foreground">
            {progress < 50
              ? 'Preparing media assets...'
              : progress < 85
              ? 'Combining footage and audio...'
              : 'Finalizing and uploading to Google Drive...'}
          </p>
        </div>
      );
    }

    if (currentProject.status === 'completed' && currentProject.finalVideoUrl) {
      return (
        <div className="space-y-6">
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
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Video</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNewProject}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Create New Video</span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Video Summary</h3>
              
              <div className="space-y-2">
                <p><span className="font-medium">Topic:</span> {currentProject.topic?.title || 'No topic selected'}</p>
                <p><span className="font-medium">Video Type:</span> {videoResolution === 'short' ? 'Short (9:16)' : 'Regular (16:9)'}</p>
                <p><span className="font-medium">Selected Video Clips:</span> {currentProject.selectedMedia.length}</p>
                <p><span className="font-medium">Sound Effects:</span> {currentProject.selectedSoundEffects.length}</p>
                <p><span className="font-medium">Music Track:</span> {currentProject.selectedMusic?.title || 'None'}</p>
                <p><span className="font-medium">Voiceover:</span> {currentProject.useVoiceover ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button
          onClick={handleAssembleVideo}
          className="w-full"
        >
          Generate Video
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Preview & Download</h2>
        <p className="text-muted-foreground">
          Create your final video and download it
        </p>
      </div>

      {renderContent()}
      
      {currentProject.status !== 'completed' && !isProcessing && (
        <div className="flex justify-start mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
