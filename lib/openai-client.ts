import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateScriptParams {
  gameName: string;
  gameDescription: string;
  targetPlatform: 'douyin' | 'kuaishou' | 'youtube';
  videoDuration: 4 | 8 | 12;
  language: 'zh' | 'en';
}

interface VideoScene {
  duration: number;
  visualPrompt: string;
  audioPrompt: string;
}

interface VideoScript {
  scenes: VideoScene[];
  totalDuration: number;
}

export async function generateScript(params: GenerateScriptParams): Promise<VideoScript> {
  const { gameName, gameDescription, targetPlatform, videoDuration, language } = params;
  
  const sceneCount = videoDuration / 2; // 每场景2秒
  
  // 平台特定的风格指导
  const platformStyles = {
    douyin: language === 'zh' ? '快节奏、年轻化、魔性音乐' : 'Fast-paced, youthful, catchy music',
    kuaishou: language === 'zh' ? '接地气、真实感、强互动' : 'Down-to-earth, authentic, interactive',
    youtube: language === 'zh' ? '精致、专业、国际化' : 'Polished, professional, international'
  };

  const systemPrompt = language === 'zh' 
    ? `你是一个专业的游戏视频脚本创作者。请为${targetPlatform}平台创作一个${videoDuration}秒的游戏宣传视频脚本。

平台风格: ${platformStyles[targetPlatform]}

要求:
1. 严格使用中文
2. 总时长${videoDuration}秒
3. 分为${sceneCount}个场景，每场景2秒
4. 每个场景包含视觉提示(visualPrompt)和音频提示(audioPrompt)
5. 视觉提示要详细描述画面内容
6. 音频提示描述配音或音效

请以JSON格式输出，格式如下:
{
  "scenes": [
    {
      "duration": 2,
      "visualPrompt": "场景视觉描述",
      "audioPrompt": "场景音频描述"
    }
  ],
  "totalDuration": ${videoDuration}
}`
    : `You are a professional game video script creator. Create a ${videoDuration}-second promotional video script for ${targetPlatform}.

Platform style: ${platformStyles[targetPlatform]}

Requirements:
1. Use English only
2. Total duration: ${videoDuration} seconds
3. Divide into ${sceneCount} scenes, 2 seconds each
4. Each scene includes visualPrompt and audioPrompt
5. Visual prompt should describe the scene in detail
6. Audio prompt describes voice-over or sound effects

Output in JSON format:
{
  "scenes": [
    {
      "duration": 2,
      "visualPrompt": "Scene visual description",
      "audioPrompt": "Scene audio description"
    }
  ],
  "totalDuration": ${videoDuration}
}`;

  const userPrompt = language === 'zh'
    ? `游戏名称: ${gameName}\n游戏描述: ${gameDescription}`
    : `Game name: ${gameName}\nGame description: ${gameDescription}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  const script: VideoScript = JSON.parse(content);
  return script;
}
