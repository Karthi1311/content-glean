
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface VideoProcessingProps {
  progress: number;
}

const VideoProcessing: React.FC<VideoProcessingProps> = ({ progress }) => {
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
};

export default VideoProcessing;
