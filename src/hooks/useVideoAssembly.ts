
import { useState } from 'react';
import { VideoProject } from '@/types';
import { assembleVideo, uploadToGoogleDrive, searchStockMedia, searchSoundEffects, searchMusicTracks } from '@/utils/api';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/use-toast';

export function useVideoAssembly() {
  const { currentProject, updateProject, setIsLoading, setError } = useApp();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoResolution, setVideoResolution] = useState<'short' | 'regular'>('regular');

  // New function to auto-select media based on script
  const autoSelectMedia = async () => {
    if (!currentProject.topic || !currentProject.script) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Extract keywords from script for better search results
      const scriptContent = currentProject.script.content;
      const topicTitle = currentProject.topic.title;
      
      // Generate search terms from script and topic
      const searchTerms = extractKeywords(scriptContent, topicTitle);
      
      // Fetch stock media based on search terms
      const stockMedia = await searchStockMedia(searchTerms.join(' '));
      
      // Fetch sound effects based on search terms
      const soundEffects = await searchSoundEffects(searchTerms.join(' '));
      
      // Fetch music tracks based on mood of the script
      const musicMood = determineMusicMood(scriptContent);
      const musicTracks = await searchMusicTracks(`${musicMood} music`);
      
      // Select best media options
      const selectedMedia = stockMedia.slice(0, 5); // Pick top 5 videos
      const selectedSoundEffects = soundEffects.slice(0, 3); // Pick top 3 sound effects
      const selectedMusic = musicTracks.length > 0 ? musicTracks[0] : null; // Pick top music track
      
      // Update project with selected media
      updateProject({
        selectedMedia,
        selectedSoundEffects,
        selectedMusic,
      });
      
      toast({
        title: "Media automatically selected",
        description: `Selected ${selectedMedia.length} videos, ${selectedSoundEffects.length} sound effects, and 1 music track.`,
      });
      
      return {
        media: selectedMedia,
        soundEffects: selectedSoundEffects,
        music: selectedMusic,
      };
    } catch (error) {
      console.error('Error in auto media selection:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during media selection');
      
      toast({
        title: "Media selection failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract keywords from script
  const extractKeywords = (script: string, topic: string): string[] => {
    // Basic keyword extraction - in a real app, this would use NLP
    const words = script.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'for', 'on', 'with'];
    
    // Filter out stop words and get unique keywords
    const uniqueWords = [...new Set(words
      .filter(word => !stopWords.includes(word) && word.length > 3)
      .map(word => word.replace(/[.,!?;:'"()]/g, ''))
      .filter(word => word.length > 3)
    )];
    
    // Add the topic as a keyword
    const keywords = [...topic.toLowerCase().split(' '), ...uniqueWords.slice(0, 5)];
    
    return keywords;
  };
  
  // Helper function to determine music mood from script
  const determineMusicMood = (script: string): string => {
    const lowerScript = script.toLowerCase();
    
    // Simple mood detection based on keyword presence
    if (lowerScript.includes('energetic') || lowerScript.includes('exciting') || 
        lowerScript.includes('fast') || lowerScript.includes('action')) {
      return 'upbeat';
    } else if (lowerScript.includes('sad') || lowerScript.includes('emotional') || 
               lowerScript.includes('tragic')) {
      return 'emotional';
    } else if (lowerScript.includes('technology') || lowerScript.includes('future') || 
               lowerScript.includes('digital')) {
      return 'electronic';
    } else if (lowerScript.includes('nature') || lowerScript.includes('peaceful') || 
               lowerScript.includes('calm')) {
      return 'ambient';
    }
    
    // Default to corporate/background music
    return 'background';
  };

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
      
      // If no media is selected yet, auto-select it
      let mediaData = {
        media: currentProject.selectedMedia,
        soundEffects: currentProject.selectedSoundEffects,
        music: currentProject.selectedMusic
      };
      
      if (currentProject.selectedMedia.length === 0) {
        const autoSelectedMedia = await autoSelectMedia();
        if (autoSelectedMedia) {
          mediaData = autoSelectedMedia;
        }
      }
      
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
        media: mediaData.media.length > 0 
          ? mediaData.media.map(m => m.url)
          : ['https://player.vimeo.com/external/577442929.hd.mp4?s=95231c8a7fe2066ffb640204591b01a6c326b97c&profile_id=174&oauth2_token_id=57447761'], // Default media if none selected
        soundEffects: mediaData.soundEffects.map(s => s.url),
        music: mediaData.music?.previewUrl || null,
        useVoiceover: currentProject.useVoiceover,
        videoResolution: videoResolution
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
        selectedMedia: mediaData.media.length > 0 
          ? mediaData.media 
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
    videoResolution,
    setVideoResolution,
    autoSelectMedia
  };
}
