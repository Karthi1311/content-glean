
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface VideoSummaryProps {
  videoResolution: 'short' | 'regular';
  onGenerateVideo: () => Promise<void>;
}

const VideoSummary: React.FC<VideoSummaryProps> = ({ 
  videoResolution, 
  onGenerateVideo 
}) => {
  const { currentProject } = useApp();

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
        onClick={onGenerateVideo}
        className="w-full"
      >
        Generate Video
      </Button>
    </div>
  );
};

export default VideoSummary;
