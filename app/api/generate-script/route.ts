import { NextRequest, NextResponse } from 'next/server';
import { generateScript } from '@/lib/openai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameName, gameDescription, targetPlatform, videoDuration, language } = body;

    // 验证必需参数
    if (!gameName || !gameDescription || !targetPlatform || !videoDuration || !language) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      );
    }

    // 调用OpenAI生成脚本
    const script = await generateScript({
      gameName,
      gameDescription,
      targetPlatform,
      videoDuration,
      language,
    });

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Script generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '脚本生成失败' },
      { status: 500 }
    );
  }
}
