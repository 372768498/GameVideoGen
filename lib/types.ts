// ========================================
// Core Type Definitions for GameVideoGen
// ========================================

/**
 * Supported video platforms
 */
export type Platform = 'douyin' | 'kuaishou' | 'youtube';

/**
 * Video durations in seconds
 */
export type VideoDuration = 4 | 8 | 12;

/**
 * Video aspect ratios
 */
export type AspectRatio = '16:9' | '9:16';

/**
 * Supported languages
 */
export type Language = 'zh' | 'en';

/**
 * Video generation status
 */
export type VideoStatus = 'pending' | 'generating_script' | 'generating_video' | 'completed' | 'failed';

// ========================================
// Script Generation Types
// ========================================

/**
 * Single scene in a video script
 */
export interface ScriptScene {
  /** Scene duration in seconds */
  duration: number;
  /** Visual description for video generation */
  visualPrompt: string;
  /** Audio/voiceover prompt (optional) */
  audioPrompt?: string;
}

/**
 * Complete video script structure
 */
export interface VideoScript {
  /** Array of scenes */
  scenes: ScriptScene[];
  /** Total duration of the video */
  totalDuration: VideoDuration;
}

/**
 * Request payload for script generation
 */
export interface ScriptGenerationRequest {
  /** Name of the game */
  gameName: string;
  /** Detailed description of the game */
  gameDescription: string;
  /** Target platform for the video */
  targetPlatform: Platform;
  /** Desired video duration */
  videoDuration: VideoDuration;
  /** Language for script generation */
  language: Language;
}

/**
 * Response from script generation API
 */
export interface ScriptGenerationResponse {
  /** Generated script */
  script: VideoScript;
  /** Estimated cost in USD */
  estimatedCost: number;
}

// ========================================
// Video Generation Types
// ========================================

/**
 * Request payload for video generation
 */
export interface VideoGenerationRequest {
  /** Combined visual prompt from all scenes */
  prompt: string;
  /** Video duration (must include 's' suffix for FAL.AI) */
  duration: '4s' | '8s' | '12s';
  /** Aspect ratio */
  aspectRatio: AspectRatio;
}

/**
 * Response from video generation API
 */
export interface VideoGenerationResponse {
  /** URL of the generated video */
  videoUrl: string;
  /** URL of the video thumbnail (optional) */
  thumbnailUrl?: string;
  /** Generation cost in USD */
  cost: number;
}

// ========================================
// Database Types (Supabase)
// ========================================

/**
 * Video record in database
 */
export interface VideoRecord {
  /** Unique identifier */
  id: string;
  /** User ID (foreign key to auth.users) */
  userId: string;
  /** Game name */
  gameName: string;
  /** Game description */
  gameDescription: string;
  /** Target platform */
  targetPlatform: Platform;
  /** Video duration in seconds */
  videoDuration: VideoDuration;
  /** Aspect ratio */
  aspectRatio: AspectRatio;
  /** Language */
  language: Language;
  /** Generated script (JSON) */
  scriptContent: VideoScript | null;
  /** URL of generated video */
  videoUrl: string | null;
  /** URL of video thumbnail */
  thumbnailUrl: string | null;
  /** Generation cost in USD */
  generationCost: number | null;
  /** Current status */
  status: VideoStatus;
  /** Error message if failed */
  errorMessage: string | null;
  /** Additional metadata (JSON) */
  metadata: Record<string, any> | null;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Completion timestamp */
  completedAt: string | null;
}

// ========================================
// Cost Estimation
// ========================================

/**
 * Cost breakdown for video generation
 */
export interface CostEstimate {
  /** OpenAI script generation cost */
  scriptCost: number;
  /** FAL.AI video generation cost */
  videoCost: number;
  /** Total cost */
  totalCost: number;
}

// ========================================
// UI Component Props
// ========================================

/**
 * Form values for video generation
 */
export interface VideoFormValues {
  gameTitle: string;
  gameDescription: string;
  platform: Platform;
  duration: VideoDuration;
  aspectRatio: AspectRatio;
  language: Language;
}

/**
 * Generation progress state
 */
export interface GenerationProgress {
  /** Current step */
  step: 'idle' | 'script' | 'video' | 'complete' | 'error';
  /** Progress percentage (0-100) */
  progress: number;
  /** Status message */
  message: string;
  /** Generated script (if available) */
  script?: VideoScript;
  /** Generated video URL (if available) */
  videoUrl?: string;
  /** Error message (if failed) */
  error?: string;
}

// ========================================
// API Error Response
// ========================================

/**
 * Standardized error response
 */
export interface ApiError {
  /** Error message */
  error: string;
  /** Detailed error information (optional) */
  details?: any;
}

// ========================================
// Utility Types
// ========================================

/**
 * Platform display information
 */
export interface PlatformInfo {
  value: Platform;
  label: string;
  defaultAspectRatio: AspectRatio;
  description: string;
}

/**
 * Duration option
 */
export interface DurationOption {
  value: VideoDuration;
  label: string;
  scenes: number;
  cost: number;
}
