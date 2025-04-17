
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { useVideoAssembly } from '@/hooks/useVideoAssembly';
import { ArrowLeft, Download, RefreshCw, Share2 } from 'lucide-react';

const VideoPreview: React.FC = () => {
  const { currentProject, updateProject, setCurrentStep, resetProject } = useApp();
  const { startAssembly, progress, isProcessing } = useVideoAssembly();

  const handleAssembleVideo = async () => {
    await startAssembly();
  };

  const handleDownload = () => {
    if (currentProject.driveDownloadUrl) {
      window.open(currentProject.driveDownloadUrl, '_blank');
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
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              src={currentProject.finalVideoUrl} 
              controls
              poster={currentProject.selectedMedia[0]?.thumbnailUrl}
              className="w-full h-full"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download from Google Drive</span>
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
                <p><span className="font-medium">Topic:</span> {currentProject.topic?.title}</p>
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
          Assemble Video
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
