
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { searchStockMedia, searchSoundEffects, searchMusicTracks } from '@/utils/api';
import { useApp } from '@/context/AppContext';
import { StockMedia, SoundEffect, MusicTrack } from '@/types';
import { ArrowLeft, ArrowRight, Film, Music, Volume2, Check, Loader, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MediaSelector: React.FC = () => {
  const { currentProject, updateProject, setCurrentStep, isLoading, setIsLoading, setError } = useApp();
  
  const [videos, setVideos] = useState<StockMedia[]>([]);
  const [soundEffects, setSoundEffects] = useState<SoundEffect[]>([]);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  
  const [selectedVideos, setSelectedVideos] = useState<StockMedia[]>(currentProject.selectedMedia || []);
  const [selectedSoundEffects, setSelectedSoundEffects] = useState<SoundEffect[]>(
    currentProject.selectedSoundEffects || []
  );
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(currentProject.selectedMusic || null);
  
  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (currentProject.topic) {
      const query = currentProject.topic.title;
      loadInitialMedia(query);
    }
  }, [currentProject.topic]);

  const loadInitialMedia = async (query: string) => {
    try {
      setIsLoading(true);
      setIsSearching(true);
      
      // Load all media types in parallel
      const [videosData, soundData, musicData] = await Promise.all([
        searchStockMedia(query),
        searchSoundEffects(query),
        searchMusicTracks('NCS music')
      ]);
      
      setVideos(videosData);
      setSoundEffects(soundData);
      setMusicTracks(musicData);
    } catch (error) {
      console.error('Failed to load media:', error);
      setError('Failed to load media. Please try again.');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      
      const query = searchQuery.trim();
      
      // Search based on active tab
      if (activeTab === 'videos') {
        const results = await searchStockMedia(query);
        setVideos(results);
      } else if (activeTab === 'sounds') {
        const results = await searchSoundEffects(query);
        setSoundEffects(results);
      } else if (activeTab === 'music') {
        const results = await searchMusicTracks(query);
        setMusicTracks(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleVideoSelection = (video: StockMedia) => {
    if (selectedVideos.some(v => v.id === video.id)) {
      setSelectedVideos(selectedVideos.filter(v => v.id !== video.id));
    } else {
      setSelectedVideos([...selectedVideos, video]);
    }
  };

  const toggleSoundEffectSelection = (sound: SoundEffect) => {
    if (selectedSoundEffects.some(s => s.id === sound.id)) {
      setSelectedSoundEffects(selectedSoundEffects.filter(s => s.id !== sound.id));
    } else {
      setSelectedSoundEffects([...selectedSoundEffects, sound]);
    }
  };

  const selectMusicTrack = (track: MusicTrack) => {
    setSelectedMusic(selectedMusic?.id === track.id ? null : track);
  };

  const handleBack = () => {
    setCurrentStep('script');
  };

  const handleContinue = () => {
    if (selectedVideos.length === 0) {
      setError('Please select at least one video clip');
      return;
    }
    
    updateProject({
      selectedMedia: selectedVideos,
      selectedSoundEffects,
      selectedMusic,
    });
    
    setCurrentStep('assembly');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Select Media</h2>
        <p className="text-muted-foreground">
          Choose videos, sounds, and music for your content
        </p>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          variant="outline"
        >
          {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <Film className="h-4 w-4" />
            <span>Videos</span>
            {selectedVideos.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {selectedVideos.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sounds" className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span>Sounds</span>
            {selectedSoundEffects.length > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {selectedSoundEffects.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="music" className="flex items-center space-x-2">
            <Music className="h-4 w-4" />
            <span>Music</span>
            {selectedMusic && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                1
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className={`cursor-pointer overflow-hidden ${
                    selectedVideos.some(v => v.id === video.id)
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  onClick={() => toggleVideoSelection(video)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    {selectedVideos.some(v => v.id === video.id) && (
                      <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium truncate">{video.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Duration: {video.duration || 'N/A'}s
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sounds" className="space-y-4">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {soundEffects.map((sound) => (
                <Card
                  key={sound.id}
                  className={`cursor-pointer ${
                    selectedSoundEffects.some(s => s.id === sound.id)
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  onClick={() => toggleSoundEffectSelection(sound)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Volume2 className="h-10 w-10 text-primary flex-shrink-0" />
                      <div>
                        <h3 className="font-medium line-clamp-2">{sound.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Duration: {sound.duration.toFixed(1)}s
                        </p>
                        <audio
                          controls
                          src={sound.url}
                          className="mt-2 w-full"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="music" className="space-y-4">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {musicTracks.map((track) => (
                <Card
                  key={track.id}
                  className={`cursor-pointer ${
                    selectedMusic?.id === track.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => selectMusicTrack(track)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={track.thumbnailUrl}
                        alt={track.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">{track.title}</h3>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                      {selectedMusic?.id === track.id && (
                        <div className="bg-primary text-white p-1 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedVideos.length === 0}
          className="flex items-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MediaSelector;
