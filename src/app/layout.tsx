import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CalmOS · 焦虑缓解器',
  description: '基于 AI 的轻量级焦虑缓解工具 — 3 分钟诊断，即时给出个性化缓解方案',
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
