# 🎮 GameVideoGen - AI游戏视频生成器

> 使用OpenAI GPT-4和FAL.AI SORA2自动生成专业游戏宣传视频

[![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)](https://openai.com/)
[![FAL.AI](https://img.shields.io/badge/FAL.AI-SORA2-purple)](https://fal.ai/)

## ✨ 功能特性

- 🤖 **AI脚本生成**: 使用GPT-4根据游戏信息自动生成专业视频脚本
- 🎬 **AI视频生成**: 使用SORA2将脚本转换为高质量游戏宣传视频
- 🌐 **多平台优化**: 支持抖音、快手、YouTube等不同平台的视频规格
- 🎨 **多格式支持**: 支持9:16竖屏和16:9横屏两种视频格式
- ⏱️ **灵活时长**: 支持4秒、8秒、12秒三种视频时长
- 🌍 **中英双语**: 支持中文和英文内容生成
- 💰 **成本透明**: 实时显示生成成本预估

## 🚀 快速开始

### 前置要求

- Node.js >= 18.17.0
- npm >= 9.0.0
- OpenAI API Key
- FAL.AI API Key

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/372768498/GameVideoGen.git
cd GameVideoGen
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

复制 `.env.local.example` 为 `.env.local` 并填写API Keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
FAL_KEY=your_fal_key_here
```

4. **启动开发服务器**

```bash
npm run dev
```

5. **访问应用**

打开浏览器访问: http://localhost:3000

## 📖 使用指南

### 1. 填写游戏信息

- **游戏名称**: 输入游戏名称（1-100字符）
- **游戏介绍**: 详细描述游戏特点（50-1000字符）
- **语言**: 选择中文或英文
- **平台**: 选择抖音、快手或YouTube
- **时长**: 选择4秒、8秒或12秒
- **格式**: 自动根据平台选择（可手动调整）

### 2. 生成视频

点击"生成视频"按钮，系统将：

1. **阶段1** (20-30秒): 使用GPT-4生成视频脚本
2. **阶段2** (60-120秒): 使用SORA2生成视频
3. **完成**: 自动跳转到结果页面

### 3. 下载使用

- 在线预览生成的视频
- 下载视频到本地
- 复制视频链接分享

## 🏗️ 技术架构

### 前端

- **框架**: Next.js 14.2.0 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: React Server Components

### 后端

- **运行时**: Node.js
- **API**: Next.js API Routes
- **AI服务**:
  - OpenAI GPT-4 Turbo (脚本生成)
  - FAL.AI SORA2 (视频生成)

### 项目结构

```
GameVideoGen/
├── app/
│   ├── game-video-gen/        # 主页面
│   ├── api/                    # API路由
│   │   └── game-video-gen/
│   │       ├── generate-script/
│   │       └── generate-video/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── game-video-gen/         # 业务组件
│   │   ├── GenerationProgress.tsx
│   │   └── VideoPreview.tsx
│   └── ui/                     # 通用UI组件
├── lib/
│   ├── game-video-gen/         # 工具函数
│   │   ├── openai-client.ts
│   │   ├── fal-client.ts
│   │   └── types.ts
│   └── utils.ts
└── docs/                       # 文档
```

## 💰 成本说明

### API成本（每次生成）

| 服务 | 功能 | 成本 |
|------|------|------|
| OpenAI GPT-4 | 脚本生成 | ~$0.02 |
| FAL.AI SORA2 | 4秒视频 | ~$0.13 |
| FAL.AI SORA2 | 8秒视频 | ~$0.22 |
| FAL.AI SORA2 | 12秒视频 | ~$0.31 |

### 完整生成成本

- 4秒视频: $0.15
- 8秒视频: $0.24
- 12秒视频: $0.33

## 🚀 部署

### Vercel部署（推荐）

1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 部署

### 环境变量配置

在Vercel中配置：

```
OPENAI_API_KEY=your_key
FAL_KEY=your_key
```

## 📝 开发计划

- [ ] 添加视频模板系统
- [ ] 支持更多视频平台
- [ ] 添加视频编辑功能
- [ ] 支持批量生成
- [ ] 添加用户系统

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [OpenAI API文档](https://platform.openai.com/docs)
- [FAL.AI文档](https://fal.ai/docs)
- [Next.js文档](https://nextjs.org/docs)

---

**Made with ❤️ for Game Developers**
