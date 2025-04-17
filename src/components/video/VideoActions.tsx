
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/context/AppContext';

interface VideoActionsProps {
  onNewProject: () => void;
}

const VideoActions: React.FC<VideoActionsProps> = ({ onNewProject }) => {
  const { currentProject } = useApp();
  const { toast } = useToast();

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

  return (
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
        onClick={onNewProject}
        className="flex items-center space-x-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Create New Video</span>
      </Button>
    </div>
  );
};

export default VideoActions;
