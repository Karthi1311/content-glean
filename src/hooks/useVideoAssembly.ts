
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
    if (!currentProject.topic || !currentProject.script) {
      toast({
        title: "Missing components",
        description: "Please ensure you have selected a topic and generated a script.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setIsLoading(true);
      setProgress(0);
      updateProject({ status: 'assembling' });
      
      // Mock progress updates to give a realistic feel
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // Prepare project data for assembly
      const projectData = {
        topic: currentProject.topic.title,
        script: currentProject.script.content,
        media: currentProject.selectedMedia.length > 0 
          ? currentProject.selectedMedia.map(m => m.url)
          : ['https://player.vimeo.com/external/577442929.hd.mp4?s=95231c8a7fe2066ffb640204591b01a6c326b97c&profile_id=174&oauth2_token_id=57447761'], // Default media if none selected
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
        // Ensure at least some media is associated with the project for the UI
        selectedMedia: currentProject.selectedMedia.length > 0 
          ? currentProject.selectedMedia 
          : [{
              id: 'default-video',
              url: videoUrl,
              thumbnailUrl: 'https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              title: 'Default Video',
              duration: 20,
              type: 'video',
              source: 'Default'
            }]
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
