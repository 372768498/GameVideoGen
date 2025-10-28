import { NextRequest, NextResponse } from 'next/server';
import { generateVideo } from '@/lib/fal-client';
import { videoTaskStore } from '@/lib/video-task-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 从前端接收 script 和 formData
    const { script, formData } = body;

    // 如果直接传了 prompt、duration、aspectRatio 也支持
    let prompt = body.prompt;
    let duration = body.duration;
    let aspectRatio = body.aspectRatio;

    // 从 script 和 formData 构建参数
    if (script && formData) {
      // 合并所有场景的视觉提示作为 prompt
      const scenes = script.scenes || [];
      prompt = scenes.map((scene: any) => scene.visualPrompt || scene.visual_prompt).join('. ');
      
      // 从 formData 获取时长和宽高比
      duration = `${formData.duration}s`;
      aspectRatio = formData.aspectRatio;
    }

    // 验证必需参数
    if (!prompt || !duration || !aspectRatio) {
      return NextResponse.json(
        { 
          error: '缺少必需参数',
          received: { prompt: !!prompt, duration, aspectRatio }
        },
        { status: 400 }
      );
    }

    // 确保 duration 格式正确
    if (!duration.endsWith('s')) {
      duration = `${duration}s`;
    }

    // 验证duration格式
    if (!['4s', '8s', '12s'].includes(duration)) {
      return NextResponse.json(
        { error: 'duration必须是4s, 8s或12s' },
        { status: 400 }
      );
    }

    // 验证aspectRatio格式
    if (!['16:9', '9:16'].includes(aspectRatio)) {
      return NextResponse.json(
        { error: 'aspectRatio必须是16:9或9:16' },
        { status: 400 }
      );
    }

    // 生成任务ID
    const taskId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建任务记录
    videoTaskStore.createTask(taskId);

    // 立即返回任务ID，不等待视频生成完成
    const response = NextResponse.json({ 
      taskId,
      status: 'processing',
      message: '视频生成已开始，请轮询获取结果'
    });

    // 在后台异步生成视频
    generateVideoAsync(taskId, prompt, duration as "4s" | "8s" | "12s", aspectRatio as "16:9" | "9:16");

    return response;
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '视频生成失败',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// 异步生成视频
async function generateVideoAsync(
  taskId: string, 
  prompt: string, 
  duration: "4s" | "8s" | "12s", 
  aspectRatio: "16:9" | "9:16"
) {
  try {
    console.log(`[${taskId}] Starting video generation...`);
    videoTaskStore.updateTask(taskId, { status: 'processing' });

    const result = await generateVideo({ prompt, duration, aspectRatio });

    console.log(`[${taskId}] Video generation completed`);
    videoTaskStore.updateTask(taskId, {
      status: 'completed',
      videoUrl: result.videoUrl,
      thumbnailUrl: result.thumbnailUrl,
      cost: result.cost,
    });
  } catch (error) {
    console.error(`[${taskId}] Video generation failed:`, error);
    videoTaskStore.updateTask(taskId, {
      status: 'failed',
      error: error instanceof Error ? error.message : '视频生成失败',
    });
  }
}
