
export interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
}

export interface ScriptContent {
  id: string;
  content: string;
  topic: string;
  timestamp: string;
}

export interface StockMedia {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  duration?: number;
  type: 'video' | 'image';
  source: string;
}

export interface SoundEffect {
  id: string;
  url: string;
  name: string;
  duration: number;
  source: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  previewUrl: string;
  duration: number;
  youtubeId: string;
}

export interface VideoProject {
  id: string;
  topic: TrendingTopic | null;
  script: ScriptContent | null;
  selectedMedia: StockMedia[];
  selectedSoundEffects: SoundEffect[];
  selectedMusic: MusicTrack | null;
  useVoiceover: boolean;
  finalVideoUrl: string | null;
  driveFileId: string | null;
  driveDownloadUrl: string | null;
  status: 'draft' | 'assembling' | 'completed' | 'error';
  createdAt: string;
}

export type WorkflowStep = 'topic' | 'script' | 'media' | 'assembly' | 'download';
