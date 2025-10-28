import { NextRequest, NextResponse } from 'next/server';
import { videoTaskStore } from '@/lib/video-task-store';

export async function GET(request: NextRequest) {
  try {
    // 从URL参数获取taskId
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: '缺少taskId参数' },
        { status: 400 }
      );
    }

    // 查询任务状态
    const task = videoTaskStore.getTask(taskId);

    if (!task) {
      return NextResponse.json(
        { error: '任务不存在或已过期' },
        { status: 404 }
      );
    }

    // 返回任务状态
    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      videoUrl: task.videoUrl,
      thumbnailUrl: task.thumbnailUrl,
      cost: task.cost,
      error: task.error,
    });
  } catch (error) {
    console.error('Task status check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '查询失败' },
      { status: 500 }
    );
  }
}
