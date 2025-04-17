
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import TrendingTopics from '@/components/TrendingTopics';
import ScriptGenerator from '@/components/ScriptGenerator';
import MediaSelector from '@/components/MediaSelector';
import VideoPreview from '@/components/VideoPreview';
import { useToast } from '@/components/ui/use-toast';
import { Film, FileText, TrendingUp, Upload } from 'lucide-react';

const WorkflowSteps = () => {
  const { currentStep } = useApp();
  
  const steps = [
    { id: 'topic', label: 'Topic', icon: TrendingUp },
    { id: 'script', label: 'Script', icon: FileText },
    { id: 'media', label: 'Media', icon: Film },
    { id: 'assembly', label: 'Assembly', icon: Upload },
  ];
  
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4 sm:space-x-8">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isComplete = 
            (step.id === 'topic' && currentStep !== 'topic') ||
            (step.id === 'script' && ['media', 'assembly'].includes(currentStep)) ||
            (step.id === 'media' && currentStep === 'assembly');
          
          return (
            <div 
              key={step.id} 
              className={`step-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
            >
              <div className="step">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="text-sm mt-1">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MainContent = () => {
  const { currentStep, error } = useApp();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  return (
    <div>
      <WorkflowSteps />
      
      <div className="container max-w-4xl mx-auto px-4">
        {currentStep === 'topic' && <TrendingTopics />}
        {currentStep === 'script' && <ScriptGenerator />}
        {currentStep === 'media' && <MediaSelector />}
        {(currentStep === 'assembly' || currentStep === 'download') && <VideoPreview />}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen pb-12">
        <header className="gradient-bg py-8 px-4 mb-8">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Trend Finder
            </h1>
            <p className="text-white text-center mt-2 opacity-90">
              Create engaging trending content in minutes
            </p>
          </div>
        </header>
        
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default Index;
