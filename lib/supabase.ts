import { createClient } from '@supabase/supabase-js';
import type { VideoRow, VideoInsert, VideoUpdate, VideoTask, TaskStatus } from './types';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 数据库操作类
 */
export class VideoTaskDB {
  /**
   * 创建新的视频任务
   */
  static async createTask(data: VideoInsert): Promise<VideoRow> {
    const { data: task, error } = await supabase
      .from('videos')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Failed to create task:', error);
      throw new Error(`创建任务失败: ${error.message}`);
    }

    return task;
  }

  /**
   * 获取任务详情
   */
  static async getTask(taskId: string): Promise<VideoRow | null> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // 任务不存在
        return null;
      }
      console.error('Failed to get task:', error);
      throw new Error(`获取任务失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新任务
   */
  static async updateTask(taskId: string, updates: VideoUpdate): Promise<VideoRow> {
    const { data, error } = await supabase
      .from('videos')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update task:', error);
      throw new Error(`更新任务失败: ${error.message}`);
    }

    return data;
  }

  /**
   * 更新任务状态
   */
  static async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    additionalData?: Partial<VideoUpdate>
  ): Promise<VideoRow> {
    const updates: VideoUpdate = {
      status,
      ...additionalData,
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    return this.updateTask(taskId, updates);
  }

  /**
   * 将数据库行转换为API响应格式
   */
  static rowToTask(row: VideoRow): VideoTask {
    return {
      id: row.id,
      status: row.status,
      gameName: row.game_name,
      gameDescription: row.game_description,
      platform: row.platform,
      duration: row.duration as 4 | 8 | 12,
      aspectRatio: row.aspect_ratio,
      language: row.language,
      script: row.script || undefined,
      videoUrl: row.video_url || undefined,
      thumbnailUrl: row.thumbnail_url || undefined,
      cost: row.cost,
      errorMessage: row.error_message || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at || undefined,
    };
  }
}
