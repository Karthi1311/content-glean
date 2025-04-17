
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchTrendingTopics } from '@/utils/api';
import { TrendingTopic } from '@/types';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Loader, TrendingUp, Search } from 'lucide-react';

const TrendingTopics: React.FC = () => {
  const { updateProject, setCurrentStep, isLoading, setIsLoading, setError } = useApp();
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [customTopic, setCustomTopic] = useState('');

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setIsLoading(true);
        const trendingTopics = await fetchTrendingTopics();
        setTopics(trendingTopics);
      } catch (error) {
        console.error('Failed to load trending topics:', error);
        setError('Failed to load trending topics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, [setError, setIsLoading]);

  const handleTopicSelect = (topic: TrendingTopic) => {
    setSelectedTopic(topic);
    setCustomTopic('');
  };

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
    setSelectedTopic(null);
  };

  const handleContinue = () => {
    if (selectedTopic) {
      updateProject({ topic: selectedTopic });
      setCurrentStep('script');
    } else if (customTopic.trim()) {
      const newTopic: TrendingTopic = {
        id: `custom-${Date.now()}`,
        title: customTopic.trim(),
        description: 'Custom topic',
        url: '',
        source: 'Custom',
      };
      updateProject({ topic: newTopic });
      setCurrentStep('script');
    }
  };

  const isTopicSelected = !!selectedTopic || customTopic.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose a Trending Topic</h2>
        <p className="text-muted-foreground">
          Select a trending topic or enter your own to create content around
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter your own topic..."
            value={customTopic}
            onChange={handleCustomTopicChange}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <Card 
                key={topic.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTopic?.id === topic.id ? 'border-primary ring-2 ring-primary/20' : ''
                }`}
                onClick={() => handleTopicSelect(topic)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium line-clamp-2">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Source: {topic.source}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleContinue}
              disabled={!isTopicSelected}
              className="flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrendingTopics;
