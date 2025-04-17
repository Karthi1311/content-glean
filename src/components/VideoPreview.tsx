
import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useVideoAssembly } from '@/hooks/useVideoAssembly';
import { ArrowLeft } from 'lucide-react';
import VideoSummary from './video/VideoSummary';
import VideoProcessing from './video/VideoProcessing';
import VideoPlayer from './video/VideoPlayer';
import VideoActions from './video/VideoActions';

const VideoPreview: React.FC = () => {
  const { currentProject, updateProject, setCurrentStep, resetProject } = useApp();
  const { startAssembly, progress, isProcessing, videoResolution } = useVideoAssembly();

  const handleAssembleVideo = async () => {
    await startAssembly();
  };

  const handleBack = () => {
    setCurrentStep('script');
  };

  const handleNewProject = () => {
    resetProject();
    setCurrentStep('topic');
  };

  const renderContent = () => {
    if (isProcessing) {
      return <VideoProcessing progress={progress} />;
    }

    if (currentProject.status === 'completed' && currentProject.finalVideoUrl) {
      return (
        <div className="space-y-6">
          <VideoPlayer videoResolution={videoResolution} />
          <VideoActions onNewProject={handleNewProject} />
        </div>
      );
    }

    return (
      <VideoSummary 
        videoResolution={videoResolution}
        onGenerateVideo={handleAssembleVideo}
      />
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
