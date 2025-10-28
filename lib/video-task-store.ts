// 简单的内存存储来跟踪视频生成任务
// 注意：这在生产环境中应该使用数据库或Redis

interface VideoTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  cost?: number;
  error?: string;
  createdAt: number;
}

class VideoTaskStore {
  private tasks: Map<string, VideoTask> = new Map();
  private readonly TTL = 3600000; // 1小时过期

  createTask(id: string): VideoTask {
    const task: VideoTask = {
      id,
      status: 'pending',
      createdAt: Date.now(),
    };
    this.tasks.set(id, task);
    this.cleanup(); // 清理过期任务
    return task;
  }

  getTask(id: string): VideoTask | undefined {
    return this.tasks.get(id);
  }

  updateTask(id: string, updates: Partial<VideoTask>): void {
    const task = this.tasks.get(id);
    if (task) {
      Object.assign(task, updates);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, task] of this.tasks.entries()) {
      if (now - task.createdAt > this.TTL) {
        this.tasks.delete(id);
      }
    }
  }
}

// 导出单例
export const videoTaskStore = new VideoTaskStore();
