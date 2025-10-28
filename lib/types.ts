// ==========================================
// 核心数据类型定义
// ==========================================

/**
 * 支持的平台
 */
export type Platform = 'douyin' | 'kuaishou' | 'youtube';

/**
 * 支持的语言
 */
export type Language = 'zh' | 'en';

/**
 * 支持的视频时长（秒）
 */
export type VideoDuration = 4 | 8 | 12;

/**
 * 支持的宽高比
 */
export type AspectRatio = '9:16' | '16:9';

/**
 * 任务状态
 */
export type TaskStatus = 'pending' | 'generating_script' | 'generating_video' | 'completed' | 'failed';

// ==========================================
// 请求和响应类型
// ==========================================

/**
 * 创建视频任务的请求
 */
export interface CreateVideoTaskRequest {
  gameName: string;
  gameDescription: string;
  platform: Platform;
  duration: VideoDuration;
  aspectRatio: AspectRatio;
  language: Language;
}

/**
 * 视频场景
 */
export interface VideoScene {
  duration: number;
  visualPrompt: string;
  audioPrompt: string;
}

/**
 * 视频脚本
 */
export interface VideoScript {
  scenes: VideoScene[];
  totalDuration: number;
}

/**
 * 视频任务响应
 */
export interface VideoTask {
  id: string;
  status: TaskStatus;
  gameName: string;
  gameDescription: string;
  platform: Platform;
  duration: VideoDuration;
  aspectRatio: AspectRatio;
  language: Language;
  script?: VideoScript;
  videoUrl?: string;
  thumbnailUrl?: string;
  cost: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * 创建任务响应
 */
export interface CreateTaskResponse {
  taskId: string;
  status: TaskStatus;
  message: string;
}

/**
 * 任务状态响应
 */
export interface TaskStatusResponse {
  task: VideoTask;
}

// ==========================================
// 数据库模型（Supabase）
// ==========================================

/**
 * videos表的行类型
 */
export interface VideoRow {
  id: string;
  status: TaskStatus;
  game_name: string;
  game_description: string;
  platform: Platform;
  duration: number;
  aspect_ratio: AspectRatio;
  language: Language;
  script: VideoScript | null;
  video_url: string | null;
  thumbnail_url: string | null;
  cost: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

/**
 * 插入videos表的数据
 */
export type VideoInsert = Omit<VideoRow, 'id' | 'created_at' | 'updated_at'>;

/**
 * 更新videos表的数据
 */
export type VideoUpdate = Partial<Omit<VideoRow, 'id' | 'created_at'>>;
