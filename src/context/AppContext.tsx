
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoProject, WorkflowStep, TrendingTopic } from '@/types';

interface AppContextValue {
  currentStep: WorkflowStep;
  setCurrentStep: (step: WorkflowStep) => void;
  currentProject: VideoProject;
  updateProject: (updates: Partial<VideoProject>) => void;
  resetProject: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const defaultProject: VideoProject = {
  id: '',
  topic: null,
  script: null,
  selectedMedia: [],
  selectedSoundEffects: [],
  selectedMusic: null,
  useVoiceover: false,
  finalVideoUrl: null,
  driveFileId: null,
  driveDownloadUrl: null,
  status: 'draft',
  createdAt: new Date().toISOString(),
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('topic');
  const [currentProject, setCurrentProject] = useState<VideoProject>({
    ...defaultProject,
    id: `project-${Date.now()}`
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = (updates: Partial<VideoProject>) => {
    setCurrentProject(prev => ({ ...prev, ...updates }));
  };

  const resetProject = () => {
    setCurrentProject({
      ...defaultProject,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    setCurrentStep('topic');
    setError(null);
  };

  // Load project from localStorage if exists
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        const parsedProject = JSON.parse(savedProject);
        setCurrentProject(parsedProject);
        
        // Set step based on project status
        if (parsedProject.topic && !parsedProject.script) {
          setCurrentStep('script');
        } else if (parsedProject.script && parsedProject.selectedMedia.length === 0) {
          setCurrentStep('media');
        } else if (parsedProject.selectedMedia.length > 0 && parsedProject.status !== 'completed') {
          setCurrentStep('assembly');
        } else if (parsedProject.status === 'completed') {
          setCurrentStep('download');
        }
      } catch (e) {
        console.error('Failed to load saved project', e);
      }
    }
  }, []);

  // Save project to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currentProject', JSON.stringify(currentProject));
  }, [currentProject]);

  return (
    <AppContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        currentProject,
        updateProject,
        resetProject,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
