import { NextRequest, NextResponse } from 'next/server';
import { generateVideo } from '@/lib/fal-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration, aspectRatio } = body;

    // 验证必需参数
    if (!prompt || !duration || !aspectRatio) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      );
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
      { error: error instanceof Error ? error.message : '视频生成失败' },
      { status: 500 }
    );
  }
}
