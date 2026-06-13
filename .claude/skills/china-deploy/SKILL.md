---
name: china-deploy
description: CalmOS 部署指南 — Next.js + Supabase + Vercel 技术栈。GitHub Pages 已被废弃（只支持静态网站，无法部署自定义 API）。
metadata:
  type: skill
  tags: [deployment, vercel, nextjs, supabase, serverless]
---

# CalmOS 部署指南

**当前技术栈**：Next.js 14 + Supabase + Vercel

> ⚠️ GitHub Pages 已废弃。老师指出：GitHub Pages 只支持静态网站，不支持 Next.js 前后端一体部署，会导致自定义 API（如 AI 请求）无法使用。

## 部署地址

| 环境 | 地址 |
|------|------|
| 生产 | `https://693.vercel.app` |
| Vercel 管理 | `https://vercel.com/zhy20260206-1444s-projects/6.93` |

## 架构

```
User → Vercel (Next.js) → /api/analyze (Serverless Function) → DeepSeek API
                        → Supabase (PostgreSQL)
```

## 本地开发

```bash
npm run dev        # next dev -p 3458 → http://localhost:3458
```

## 部署命令

```bash
# 部署到生产环境
vercel --prod --yes

# 查看部署状态
vercel inspect <deployment-url>
```

## 环境变量 (Vercel)

| 变量 | 说明 |
|------|------|
| DEEPSEEK_API_KEY | DeepSeek API 密钥 |
| DEEPSEEK_MODEL | 模型名 (deepseek-chat) |
| SUPABASE_URL | Supabase 项目 URL |
| SUPABASE_ANON_KEY | Supabase 匿名公钥 |

管理入口：`https://vercel.com/zhy20260206-1444s-projects/6.93/settings/environment-variables`

## 备份 API

Supabase Edge Function 仍然可用作备份：
- `https://rjxbcxcnjnwplroytnan.supabase.co/functions/v1/analyze`

## 后台管理

| 后台 | 链接 |
|------|------|
| Vercel Dashboard | https://vercel.com/zhy20260206-1444s-projects/6.93 |
| Supabase Dashboard | https://supabase.com/dashboard/project/rjxbcxcnjnwplroytnan |
| GitHub 仓库 | https://github.com/zhy20260206-dev/calmos |
| DeepSeek Platform | https://platform.deepseek.com |
