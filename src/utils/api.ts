// API Keys
const PEXELS_API_KEY = "L59jMEI6YO3wJeUAz5jFiSQmisBvFpDwinTYxQhutUS9ZlEE07UrfGPL";
const NEWSAPI_KEY = "8fa56cadeb584084aed2653f93a8233d";
const YOUTUBE_API_KEY = "AIzaSyB0lBekl7CAOOnlhB0p4MDzd7-JTYopz4k";
const OPENROUTE_API_KEY = "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";
const FREESOUND_API_KEY = "G3qNEBE21gs5gjIcyokqUxIaFHyVEeTZS5bbVkAf";

import { TrendingTopic, ScriptContent, StockMedia, SoundEffect, MusicTrack } from '@/types';

// Mock trending topics for when API fails
const MOCK_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'topic-1',
    title: 'AI in Healthcare',
    description: 'How artificial intelligence is transforming healthcare delivery and patient outcomes',
    url: 'https://example.com/ai-healthcare',
    source: 'Tech News',
  },
  {
    id: 'topic-2',
    title: 'Climate Change Solutions',
    description: 'Innovative approaches to combat climate change and reduce carbon emissions',
    url: 'https://example.com/climate-solutions',
    source: 'Environment Daily',
  },
  {
    id: 'topic-3',
    title: 'Remote Work Trends',
    description: 'The evolving landscape of remote work and its impact on the global workforce',
    url: 'https://example.com/remote-work',
    source: 'Business Insider',
  },
  {
    id: 'topic-4',
    title: 'Cryptocurrency Market',
    description: 'Recent developments and future outlook for cryptocurrencies and blockchain',
    url: 'https://example.com/crypto-market',
    source: 'Financial Times',
  },
  {
    id: 'topic-5',
    title: 'Mental Health Awareness',
    description: 'Growing focus on mental health issues and strategies for wellbeing',
    url: 'https://example.com/mental-health',
    source: 'Health Today',
  },
  {
    id: 'topic-6',
    title: 'Sustainable Fashion',
    description: 'The rise of eco-friendly and ethical practices in the fashion industry',
    url: 'https://example.com/sustainable-fashion',
    source: 'Fashion Weekly',
  },
  {
    id: 'topic-7',
    title: 'Space Exploration',
    description: 'Latest missions, discoveries, and the future of human space exploration',
    url: 'https://example.com/space-exploration',
    source: 'Science Now',
  },
  {
    id: 'topic-8',
    title: 'Electric Vehicles',
    description: 'Advancements in electric vehicle technology and market growth',
    url: 'https://example.com/electric-vehicles',
    source: 'Auto News',
  },
];

// Enhanced mock stock media with more reliable video URLs
const MOCK_STOCK_MEDIA: StockMedia[] = [
  {
    id: 'video-1',
    url: 'https://player.vimeo.com/progressive_redirect/playback/538503359/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=67bfec865c2a3e13e25b8257af712561c4348a76b0d443cc32a13f1c3a139335',
    thumbnailUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Tech Workspace',
    duration: 15,
    type: 'video',
    source: 'Pexels',
  },
  {
    id: 'video-2',
    url: 'https://player.vimeo.com/progressive_redirect/playback/449557371/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=d4c8a323cfd1cd63c75594e17f9e4e1f0e5b5f897b53b8ec8e7c6ce0fce1d9a2',
    thumbnailUrl: 'https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'City Lights',
    duration: 20,
    type: 'video',
    source: 'Pexels',
  },
  {
    id: 'video-3',
    url: 'https://player.vimeo.com/progressive_redirect/playback/577442929/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=07427f44e7dc33494e7e0b525c3b89e45923a6801cef31ba1285bf73ce881c5c',
    thumbnailUrl: 'https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Nature Scene',
    duration: 18,
    type: 'video',
    source: 'Pexels',
  },
  {
    id: 'video-4',
    url: 'https://player.vimeo.com/progressive_redirect/playback/451265280/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=0c8d86cbfc06a1f2e875ef0e36253bd57a0ce2c42f13a5042edbea9ae0c9ac02',
    thumbnailUrl: 'https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Business Meeting',
    duration: 25,
    type: 'video',
    source: 'Pexels',
  },
  {
    id: 'video-5',
    url: 'https://player.vimeo.com/progressive_redirect/playback/511626317/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=f4f5d87f5d25acfa733292c5b8c55f49f49e4e0127f6a71050c092c03959eec1',
    thumbnailUrl: 'https://images.pexels.com/photos/4144144/pexels-photo-4144144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Digital Technology',
    duration: 22,
    type: 'video',
    source: 'Pexels',
  },
];

// Mock sound effects for when API fails
const MOCK_SOUND_EFFECTS: SoundEffect[] = [
  {
    id: 'sound-1',
    url: 'https://freesound.org/data/previews/339/339809_5121236-lq.mp3',
    name: 'Notification',
    duration: 2,
    source: 'Freesound',
  },
  {
    id: 'sound-2',
    url: 'https://freesound.org/data/previews/414/414052_5121236-lq.mp3',
    name: 'Success Chime',
    duration: 3,
    source: 'Freesound',
  },
  {
    id: 'sound-3',
    url: 'https://freesound.org/data/previews/524/524741_9819009-lq.mp3',
    name: 'Ambient Background',
    duration: 10,
    source: 'Freesound',
  },
];

// Mock music tracks for when API fails
const MOCK_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'music-1',
    title: 'Chillout Lofi Hip Hop',
    artist: 'Music Producer X',
    thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg',
    previewUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    duration: 180,
    youtubeId: '5qap5aO4i9A',
  },
  {
    id: 'music-2',
    title: 'Upbeat Electronic',
    artist: 'Beat Maker Y',
    thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
    previewUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    duration: 210,
    youtubeId: 'jfKfPfyJRdk',
  },
  {
    id: 'music-3',
    title: 'Ambient Soundscape',
    artist: 'Ambient Creator Z',
    thumbnailUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/maxresdefault.jpg',
    previewUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    duration: 240,
    youtubeId: 'lTRiuFIWV54',
  },
];

// Fetch trending topics from NewsAPI with fallback to mock data
export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    // Try to fetch from the API
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}`
    );
    
    if (!response.ok) {
      // If API fails, use mock data
      console.log('Using mock trending topics due to API failure');
      return MOCK_TRENDING_TOPICS;
    }
    
    const data = await response.json();
    
    // If we get an error response from the API, fall back to mock data
    if (data.status === 'error') {
      console.log('API returned error:', data.message);
      return MOCK_TRENDING_TOPICS;
    }
    
    return data.articles.slice(0, 10).map((article: any, index: number) => ({
      id: `topic-${index}`,
      title: article.title,
      description: article.description || 'No description available',
      url: article.url,
      source: article.source.name || 'Unknown source',
    }));
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    // Return mock data in case of any error
    return MOCK_TRENDING_TOPICS;
  }
}

// Generate script content with OpenRoute API or fallback to mock
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
      // Generate a mock script based on topic
      return generateMockScript(topic);
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
    // Generate a mock script in case of error
    return generateMockScript(topic);
  }
}

// Helper function to generate mock scripts based on topic
function generateMockScript(topic: string): ScriptContent {
  let scriptContent = '';
  
  if (topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('artificial intelligence')) {
    scriptContent = `AI is revolutionizing our world! From healthcare to finance, artificial intelligence is changing how we live and work. Did you know that AI can now diagnose diseases with greater accuracy than some doctors? Or that it can predict market trends better than many analysts?\n\nBut it's not just about big data and algorithms. AI is making our everyday lives easier too - from smart assistants in our homes to personalized recommendations in our apps.\n\nThe future is here, and it's powered by artificial intelligence. Are you ready to embrace it?`;
  } else if (topic.toLowerCase().includes('climate') || topic.toLowerCase().includes('environment')) {
    scriptContent = `Climate change is the defining challenge of our generation. The earth's temperature has risen by 1.1°C since the pre-industrial era, causing more extreme weather events worldwide.\n\nBut there's hope! Renewable energy costs have dropped dramatically, making green solutions more accessible than ever. Communities around the world are taking action - from massive reforestation projects to innovative recycling programs.\n\nEvery small change matters. By adjusting our daily habits, we can collectively make a massive difference. The time to act is now. What will you do today for a better tomorrow?`;
  } else if (topic.toLowerCase().includes('work') || topic.toLowerCase().includes('remote')) {
    scriptContent = `The workplace has been transformed forever! Remote work has skyrocketed, with over 58% of Americans now having the option to work from home at least one day a week.\n\nThis shift is redefining productivity, work-life balance, and even where we choose to live. Companies embracing flexible policies are seeing higher employee satisfaction and retention.\n\nBut it's not without challenges - digital collaboration, maintaining company culture, and combating isolation are the new hurdles we face.\n\nThe future isn't about where we work, but how we work. How are you adapting to this new world of possibilities?`;
  } else {
    scriptContent = `${topic} is trending everywhere right now, and for good reason! This fascinating subject is capturing attention worldwide as experts and everyday people alike discover its incredible impact.\n\nWhat started as a niche interest has exploded into the mainstream, changing how we think about innovation and progress in today's fast-paced world.\n\nThe statistics are mind-blowing - growth in this area has increased by over 200% in just the last year alone!\n\nWhether you're just learning about ${topic} or you're already an enthusiast, one thing is clear: this trend is here to stay and will continue shaping our future in exciting ways!`;
  }
  
  return {
    id: `script-${Date.now()}`,
    content: scriptContent,
    topic,
    timestamp: new Date().toISOString(),
  };
}

// Search for stock videos with Pexels API with fallback to mock
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
      console.log('Using mock stock media due to API failure');
      return MOCK_STOCK_MEDIA;
    }

    const data = await response.json();
    
    return data.videos.map((video: any) => {
      const videoFiles = video.video_files;
      // Get HD or SD video file with direct MP4 URL
      const videoFile = videoFiles.find((file: any) => (file.quality === 'hd' || file.quality === 'sd') && file.file_type === 'video/mp4');
      
      return {
        id: `video-${video.id}`,
        url: videoFile?.link || '',
        thumbnailUrl: video.image,
        title: video.user?.name || 'Pexels video',
        duration: video.duration,
        type: 'video',
        source: 'Pexels',
      };
    }).filter((video: StockMedia) => video.url !== ''); // Filter out videos with no URL
  } catch (error) {
    console.error('Error searching stock media:', error);
    return MOCK_STOCK_MEDIA;
  }
}

// Search for sound effects with Freesound API with fallback to mock
export async function searchSoundEffects(query: string): Promise<SoundEffect[]> {
  try {
    const response = await fetch(
      `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&token=${FREESOUND_API_KEY}&fields=id,name,previews,duration&filter=duration:[0 TO 10]`
    );

    if (!response.ok) {
      console.log('Using mock sound effects due to API failure');
      return MOCK_SOUND_EFFECTS;
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
    return MOCK_SOUND_EFFECTS;
  }
}

// Search for music tracks on YouTube with YouTube Data API with fallback to mock
export async function searchMusicTracks(query: string = 'NCS music'): Promise<MusicTrack[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.log('Using mock music tracks due to API failure');
      return MOCK_MUSIC_TRACKS;
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
    return MOCK_MUSIC_TRACKS;
  }
}

// Mock function for video assembly with improved, reliable output
export async function assembleVideo(projectData: any): Promise<string> {
  console.log('Assembling video with project data:', projectData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Determine which video to return based on resolution
  let videoUrl = '';
  
  if (projectData.videoResolution === 'short') {
    // Return a vertical video for shorts
    videoUrl = 'https://player.vimeo.com/progressive_redirect/playback/769519058/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=71fb5be0fb62ee9a59a7504945ef1fba26c7a38c51ff3e4e0e8db45f5b18cdd1'; // Vertical format video
  } else {
    // Return a horizontal video for regular
    videoUrl = 'https://player.vimeo.com/progressive_redirect/playback/577442929/rendition/720p/file.mp4?loc=external&oauth2_token_id=57447761&signature=07427f44e7dc33494e7e0b525c3b89e45923a6801cef31ba1285bf73ce881c5c'; // Horizontal format video
  }
  
  return videoUrl;
}

// Mock function for Google Drive upload with working download URL
export async function uploadToGoogleDrive(videoUrl: string, title: string): Promise<{ fileId: string, downloadUrl: string }> {
  console.log('Uploading to Google Drive:', { videoUrl, title });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return the same video URL for download to ensure it works
  return {
    fileId: `file-${Date.now()}`,
    downloadUrl: videoUrl, // This ensures the download URL is the same as the video URL
  };
}
