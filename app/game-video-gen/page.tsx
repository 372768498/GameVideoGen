'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerationProgress } from '@/components/game-video-gen/GenerationProgress';
import { VideoPreview } from '@/components/game-video-gen/VideoPreview';

// 在 export default function GameVideoGenPage() 之前添加
const [isAuthorized, setIsAuthorized] = useState(false);
const [password, setPassword] = useState('');
const [passwordError, setPasswordError] = useState('');

useEffect(() => {
  const savedAuth = localStorage.getItem('gameVideoGenAuth');
  if (savedAuth) {
    const { expires } = JSON.parse(savedAuth);
    if (Date.now() < expires) {
      setIsAuthorized(true);
    }
  }
}, []);

const handlePasswordSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (password === 'gamevideo2025') {
    localStorage.setItem('gameVideoGenAuth', JSON.stringify({
      token: 'authorized',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000
    }));
    setIsAuthorized(true);
  } else {
    setPasswordError('密码错误');
    setPassword('');
  }
};

// 在最外层 return 之前添加
if (!isAuthorized) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔒 访问验证</h1>
          <p className="text-gray-400">请输入访问密码</p>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">访问密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="mt-2 bg-gray-700 border-gray-600 text-white"
                autoFocus
              />
              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500">验证</Button>
          </div>
        </form>
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>授权有效期：7天</p>
        </div>
      </div>
    </div>
  );
}

export default function GameVideoGenPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    gameTitle: '',
    gameDescription: '',
    language: 'zh-CN' as 'zh-CN' | 'en-US',
    platform: 'douyin' as 'douyin' | 'kuaishou' | 'youtube',
    duration: 8 as 4 | 8 | 12,
    aspectRatio: '9:16' as '9:16' | '16:9',
  });

  const [stage, setStage] = useState<'form' | 'generating' | 'complete'>('form');
  const [progress, setProgress] = useState({
    stage: '' as 'script' | 'video' | 'complete' | '',
    progress: 0,
    currentScene: 0,
    totalScenes: 0,
    estimatedTime: 0,
  });
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});

  // 检查是否已经授权
  useEffect(() => {
    const checkAuth = () => {
      const savedAuth = localStorage.getItem('gameVideoGenAuth');
      if (savedAuth) {
        const { token, expires } = JSON.parse(savedAuth);
        if (Date.now() < expires) {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('gameVideoGenAuth');
        }
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 正确的访问密码（这个可以通过环境变量配置）
    const correctPassword = process.env.NEXT_PUBLIC_ACCESS_PASSWORD || 'gamevideo2025';
    
    if (password === correctPassword) {
      // 密码正确，保存授权状态（7天有效）
      const authData = {
        token: 'authorized',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天后过期
      };
      localStorage.setItem('gameVideoGenAuth', JSON.stringify(authData));
      setIsAuthorized(true);
      setPasswordError('');
    } else {
      setPasswordError('密码错误，请重试');
      setPassword('');
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.gameTitle) {
      newErrors.gameTitle = '请输入游戏名称';
    } else if (formData.gameTitle.length > 100) {
      newErrors.gameTitle = '游戏名称不能超过100个字符';
    }

    if (!formData.gameDescription) {
      newErrors.gameDescription = '请输入游戏介绍';
    } else if (formData.gameDescription.length < 50) {
      newErrors.gameDescription = '游戏介绍至少需要50个字符';
    } else if (formData.gameDescription.length > 1000) {
      newErrors.gameDescription = '游戏介绍不能超过1000个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    setStage('generating');
    setProgress({
      stage: 'script',
      progress: 10,
      currentScene: 0,
      totalScenes: formData.duration / 2,
      estimatedTime: 90,
    });

    try {
      // 阶段1: 生成脚本
      const scriptResponse = await fetch('/api/game-video-gen/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!scriptResponse.ok) {
        const error = await scriptResponse.json();
        throw new Error(error.message || '脚本生成失败');
      }

      const scriptData = await scriptResponse.json();
      const script = scriptData.script;

      setProgress({
        stage: 'video',
        progress: 30,
        currentScene: 0,
        totalScenes: script.total_scenes,
        estimatedTime: 60,
      });

      // 阶段2: 生成视频
      const videoResponse = await fetch('/api/game-video-gen/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          formData,
        }),
      });

      if (!videoResponse.ok) {
        const error = await videoResponse.json();
        throw new Error(error.message || '视频生成失败');
      }

      const videoData = await videoResponse.json();

      // 模拟进度更新
      for (let i = 30; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(prev => ({
          ...prev,
          progress: i,
          currentScene: Math.floor((i - 30) / 70 * script.total_scenes),
        }));
      }

      setProgress({
        stage: 'complete',
        progress: 100,
        currentScene: script.total_scenes,
        totalScenes: script.total_scenes,
        estimatedTime: 0,
      });

      // 设置生成的视频
      setGeneratedVideo({
        videoUrl: videoData.videoUrl,
        script,
        formData,
        cost: (scriptData.cost || 0) + (videoData.cost || 0),
        duration: videoData.duration,
      });

      // 延迟跳转到结果页
      setTimeout(() => {
        setStage('complete');
      }, 1000);

    } catch (error: any) {
      console.error('生成失败:', error);
      alert(`生成失败: ${error.message}`);
      setStage('form');
    }
  };

  const handleReset = () => {
    setStage('form');
    setProgress({
      stage: '',
      progress: 0,
      currentScene: 0,
      totalScenes: 0,
      estimatedTime: 0,
    });
    setGeneratedVideo(null);
  };

  const handlePlatformChange = (platform: string) => {
    const newFormData = { ...formData, platform: platform as any };
    // 根据平台自动调整格式
    if (platform === 'douyin' || platform === 'kuaishou') {
      newFormData.aspectRatio = '9:16';
    } else if (platform === 'youtube') {
      newFormData.aspectRatio = '16:9';
    }
    setFormData(newFormData);
  };

  const getCostEstimate = () => {
    const scriptCost = 0.02;
    const videoCost = formData.duration === 4 ? 0.13 : formData.duration === 8 ? 0.22 : 0.31;
    return (scriptCost + videoCost).toFixed(2);
  };

  // 检查授权中
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  // 密码验证页面
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                🔒 访问验证
              </h1>
              <p className="text-gray-400">
                请输入访问密码
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-white">
                    访问密码
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="mt-2 bg-gray-700 border-gray-600 text-white"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  验证
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>授权有效期：7天</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 生成中页面
  if (stage === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <GenerationProgress progress={progress} />
        </div>
      </div>
    );
  }

  // 完成页面
  if (stage === 'complete' && generatedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <VideoPreview video={generatedVideo} onReset={handleReset} />
        </div>
      </div>
    );
  }

  // 主表单页面
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎮 AI游戏视频生成器
          </h1>
          <p className="text-xl text-gray-300">
            使用AI自动生成专业游戏宣传视频
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by OpenAI GPT-4 & FAL.AI SORA2
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <div className="space-y-6">
            {/* 游戏名称 */}
            <div>
              <Label htmlFor="gameTitle" className="text-white">
                游戏名称 *
              </Label>
              <Input
                id="gameTitle"
                value={formData.gameTitle}
                onChange={(e) => setFormData({ ...formData, gameTitle: e.target.value })}
                placeholder="例如：狱国争霸"
                className="mt-2 bg-gray-700 border-gray-600 text-white"
              />
              {errors.gameTitle && (
                <p className="text-red-400 text-sm mt-1">{errors.gameTitle}</p>
              )}
            </div>

            {/* 游戏介绍 */}
            <div>
              <Label htmlFor="gameDescription" className="text-white">
                游戏介绍 * (50-1000字符)
              </Label>
              <Textarea
                id="gameDescription"
                value={formData.gameDescription}
                onChange={(e) => setFormData({ ...formData, gameDescription: e.target.value })}
                placeholder="详细描述游戏特点、玩法、风格等..."
                rows={6}
                className="mt-2 bg-gray-700 border-gray-600 text-white"
              />
              <p className="text-gray-400 text-sm mt-1">
                {formData.gameDescription.length} / 1000 字符
              </p>
              {errors.gameDescription && (
                <p className="text-red-400 text-sm mt-1">{errors.gameDescription}</p>
              )}
            </div>

            {/* 语言和平台 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language" className="text-white">语言</Label>
                <Select value={formData.language} onValueChange={(value: any) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">中文</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="platform" className="text-white">目标平台</Label>
                <Select value={formData.platform} onValueChange={handlePlatformChange}>
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="douyin">抖音</SelectItem>
                    <SelectItem value="kuaishou">快手</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 时长和格式 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration" className="text-white">视频时长</Label>
                <Select value={formData.duration.toString()} onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) as 4 | 8 | 12 })}>
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4秒 (2个场景)</SelectItem>
                    <SelectItem value="8">8秒 (4个场景)</SelectItem>
                    <SelectItem value="12">12秒 (6个场景)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="aspectRatio" className="text-white">视频格式</Label>
                <Select value={formData.aspectRatio} onValueChange={(value: any) => setFormData({ ...formData, aspectRatio: value })}>
                  <SelectTrigger className="mt-2 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 竖屏</SelectItem>
                    <SelectItem value="16:9">16:9 横屏</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 成本预估 */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm text-center">
                💰 预估成本: ${getCostEstimate()} USD
              </p>
            </div>

            {/* 提交按钮 */}
            <Button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-6"
            >
              🎬 生成视频
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>⚡ 生成时间约1-2分钟 | 💡 建议首次测试使用8秒时长</p>
        </div>
      </div>
    </div>
  );
}
