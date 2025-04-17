
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { generateScript } from '@/utils/api';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ArrowRight, RefreshCw, Loader, FileText } from 'lucide-react';

const ScriptGenerator: React.FC = () => {
  const { currentProject, updateProject, setCurrentStep, isLoading, setIsLoading, setError } = useApp();
  const [scriptContent, setScriptContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [useVoiceover, setUseVoiceover] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (currentProject.script) {
      setScriptContent(currentProject.script.content);
    } else {
      handleGenerateScript();
    }
    
    if (currentProject.useVoiceover !== undefined) {
      setUseVoiceover(currentProject.useVoiceover);
    }
  }, [currentProject.script]);

  const handleGenerateScript = async () => {
    if (!currentProject.topic) {
      setError('No topic selected. Please go back and select a topic.');
      return;
    }

    try {
      setIsGenerating(true);
      setIsLoading(true);
      
      const script = await generateScript(currentProject.topic.title);
      setScriptContent(script.content);
      updateProject({ script });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to generate script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScriptContent(e.target.value);
  };

  const handleSaveScript = () => {
    if (scriptContent.trim()) {
      updateProject({
        script: {
          id: currentProject.script?.id || `script-${Date.now()}`,
          content: scriptContent,
          topic: currentProject.topic?.title || '',
          timestamp: new Date().toISOString(),
        },
      });
      setIsEditing(false);
    }
  };

  const handleVoiceoverChange = (checked: boolean) => {
    setUseVoiceover(checked);
    updateProject({ useVoiceover: checked });
  };

  const handleBack = () => {
    setCurrentStep('topic');
  };

  const handleContinue = () => {
    if (scriptContent.trim()) {
      updateProject({
        script: {
          id: currentProject.script?.id || `script-${Date.now()}`,
          content: scriptContent,
          topic: currentProject.topic?.title || '',
          timestamp: new Date().toISOString(),
        },
        useVoiceover,
      });
      setCurrentStep('media');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create Your Script</h2>
        <p className="text-muted-foreground">
          Generate a script for your video or write your own
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Script for: {currentProject.topic?.title}</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateScript}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={scriptContent}
                onChange={handleScriptChange}
                className="min-h-[200px] font-medium"
                placeholder="Write your script here..."
              />
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  onClick={handleSaveScript}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md min-h-[200px] whitespace-pre-wrap">
                {isGenerating ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <p className="font-medium">{scriptContent}</p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={isGenerating}
              >
                Edit Script
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Switch
          id="voiceover"
          checked={useVoiceover}
          onCheckedChange={handleVoiceoverChange}
        />
        <Label htmlFor="voiceover">Generate AI voiceover from script</Label>
      </div>

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
          disabled={!scriptContent.trim() || isGenerating}
          className="flex items-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ScriptGenerator;
