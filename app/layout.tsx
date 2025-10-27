import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameVideoGen - AI游戏视频生成器",
  description: "使用OpenAI GPT-4和FAL.AI SORA2自动生成专业游戏宣传视频",
  keywords: ["AI", "游戏视频", "视频生成", "GPT-4", "SORA2", "游戏营销"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
