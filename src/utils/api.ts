
// API Keys
const PEXELS_API_KEY = "L59jMEI6YO3wJeUAz5jFiSQmisBvFpDwinTYxQhutUS9ZlEE07UrfGPL";
const NEWSAPI_KEY = "8fa56cadeb584084aed2653f93a8233d";
const YOUTUBE_API_KEY = "AIzaSyB0lBekl7CAOOnlhB0p4MDzd7-JTYopz4k";
const OPENROUTE_API_KEY = "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";
const FREESOUND_API_KEY = "G3qNEBE21gs5gjIcyokqUxIaFHyVEeTZS5bbVkAf";

import { TrendingTopic, ScriptContent, StockMedia, SoundEffect, MusicTrack } from '@/types';

// Fetch trending topics from NewsAPI
export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending topics');
    }
    
    const data = await response.json();
    
    return data.articles.slice(0, 10).map((article: any, index: number) => ({
      id: `topic-${index}`,
      title: article.title,
      description: article.description || 'No description available',
      url: article.url,
      source: article.source.name || 'Unknown source',
    }));
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    throw error;
  }
}

// Generate script content with OpenRoute API
export async function generateScript(topic: string): Promise<ScriptContent> {
  try {
    const response = await fetch('https://api.openroute.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a professional script writer for short-form video content. Create engaging, concise scripts that are perfect for 30-60 second videos with visual elements. Focus on being trendy, informative and engaging.'
          },
          {
            role: 'user',
            content: `Write a short, engaging script about "${topic}" for a 30-60 second trending video. Make it punchy, informative, and engaging. Maximum 150 words.`
          }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate script');
    }

    const data = await response.json();
    const scriptContent = data.choices[0]?.message?.content || 'Failed to generate script content';

    return {
      id: `script-${Date.now()}`,
      content: scriptContent,
      topic,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
}

// Search for stock videos with Pexels API
export async function searchStockMedia(query: string): Promise<StockMedia[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search stock media');
    }

    const data = await response.json();
    
    return data.videos.map((video: any) => {
      const videoFiles = video.video_files;
      // Get HD or SD video file
      const videoFile = videoFiles.find((file: any) => file.quality === 'hd' || file.quality === 'sd');
      
      return {
        id: `video-${video.id}`,
        url: videoFile?.link || '',
        thumbnailUrl: video.image,
        title: video.user?.name || 'Pexels video',
        duration: video.duration,
        type: 'video',
        source: 'Pexels',
      };
    });
  } catch (error) {
    console.error('Error searching stock media:', error);
    throw error;
  }
}

// Search for sound effects with Freesound API
export async function searchSoundEffects(query: string): Promise<SoundEffect[]> {
  try {
    const response = await fetch(
      `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&token=${FREESOUND_API_KEY}&fields=id,name,previews,duration&filter=duration:[0 TO 10]`
    );

    if (!response.ok) {
      throw new Error('Failed to search sound effects');
    }

    const data = await response.json();
    
    return data.results.map((sound: any) => ({
      id: `sound-${sound.id}`,
      url: sound.previews['preview-hq-mp3'],
      name: sound.name,
      duration: sound.duration,
      source: 'Freesound',
    }));
  } catch (error) {
    console.error('Error searching sound effects:', error);
    throw error;
  }
}

// Search for music tracks on YouTube with YouTube Data API
export async function searchMusicTracks(query: string = 'NCS music'): Promise<MusicTrack[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to search music tracks');
    }

    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: `music-${item.id.videoId}`,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      previewUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      duration: 0, // Duration is not available in search results
      youtubeId: item.id.videoId,
    }));
  } catch (error) {
    console.error('Error searching music tracks:', error);
    throw error;
  }
}

// Mock function for video assembly
export async function assembleVideo(projectData: any): Promise<string> {
  // This would be replaced with a real video assembly API
  console.log('Assembling video with project data:', projectData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Return a placeholder video URL
  return 'https://www.example.com/video.mp4';
}

// Mock function for Google Drive upload
export async function uploadToGoogleDrive(videoUrl: string, title: string): Promise<{ fileId: string, downloadUrl: string }> {
  console.log('Uploading to Google Drive:', { videoUrl, title });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return placeholder data
  return {
    fileId: `file-${Date.now()}`,
    downloadUrl: videoUrl,
  };
}
