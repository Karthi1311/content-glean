
import { useState } from 'react';
import { VideoProject } from '@/types';
import { assembleVideo, uploadToGoogleDrive } from '@/utils/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';

export function useVideoAssembly() {
  const { currentProject, updateProject, setIsLoading, setError } = useApp();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const startAssembly = async () => {
    if (!currentProject.topic || !currentProject.script || currentProject.selectedMedia.length === 0) {
      toast({
        title: "Missing components",
        description: "Please ensure you have selected a topic, generated a script, and chosen media.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setIsLoading(true);
      setProgress(0);
      updateProject({ status: 'assembling' });
      
      // Mock progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 800);
      
      // Prepare project data for assembly
      const projectData = {
        topic: currentProject.topic.title,
        script: currentProject.script.content,
        media: currentProject.selectedMedia.map(m => m.url),
        soundEffects: currentProject.selectedSoundEffects.map(s => s.url),
        music: currentProject.selectedMusic?.previewUrl || null,
        useVoiceover: currentProject.useVoiceover,
      };
      
      // Call assembly API (mocked)
      const videoUrl = await assembleVideo(projectData);
      
      // Upload to Google Drive (mocked)
      setProgress(95);
      const { fileId, downloadUrl } = await uploadToGoogleDrive(
        videoUrl, 
        `Trend Finder - ${currentProject.topic.title}`
      );
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Update project with results
      updateProject({
        finalVideoUrl: videoUrl,
        driveFileId: fileId,
        driveDownloadUrl: downloadUrl,
        status: 'completed',
      });
      
      toast({
        title: "Video assembled successfully",
        description: "Your video is ready to preview and download!",
      });
      
      return { videoUrl, fileId, downloadUrl };
    } catch (error) {
      console.error('Error in video assembly:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during video assembly');
      updateProject({ status: 'error' });
      
      toast({
        title: "Video assembly failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return {
    startAssembly,
    progress,
    isProcessing,
  };
}
