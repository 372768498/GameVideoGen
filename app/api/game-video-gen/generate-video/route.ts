import { NextRequest, NextResponse } from 'next/server';
import { generateVideo } from '@/lib/fal-client';

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

    // 调用FAL.AI生成视频
    const result = await generateVideo({
      prompt,
      duration: duration as "4s" | "8s" | "12s",
      aspectRatio: aspectRatio as "16:9" | "9:16",
    });

    return NextResponse.json(result);
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
