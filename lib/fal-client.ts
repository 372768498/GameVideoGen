import { fal } from "@fal-ai/client";

interface VideoGenerationParams {
  prompt: string;
  duration: "4s" | "8s" | "12s";
  aspectRatio: "16:9" | "9:16";
}

interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl?: string;
  cost: number;
}

export async function generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
  const { prompt, duration, aspectRatio } = params;

  try {
    // 调用FAL.AI SORA2 API
    const result = await fal.subscribe("fal-ai/minimax-video/video-01-live", {
      input: {
        prompt: prompt,
        duration: duration,
        aspect_ratio: aspectRatio,
      },
      credentials: process.env.FAL_KEY,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Video generation progress:", update);
        }
      },
    });

    // 提取视频URL
    const videoUrl = result.data?.video?.url;
    
    if (!videoUrl) {
      throw new Error("No video URL in response");
    }

    // 估算成本（基于时长）
    const costMap = {
      "4s": 0.13,
      "8s": 0.25,
      "12s": 0.37,
    };

    return {
      videoUrl: videoUrl,
      thumbnailUrl: result.data?.video?.thumbnail_url,
      cost: costMap[duration],
    };
  } catch (error) {
    console.error("FAL.AI video generation error:", error);
    throw new Error(
      error instanceof Error ? error.message : "视频生成失败"
    );
  }
}
