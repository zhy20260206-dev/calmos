# CalmOS 部署配置清单

> 请填写以下信息，填写完成后告诉我，我会继续完成部署。

---

## 1. DeepSeek API Key

| 项目 | 值 |
|------|----|
| 获取地址 | [platform.deepseek.com](https://platform.deepseek.com) |
| API Key |sk-1c3a86025ec2439daf87237989313503

> 注册后在「API Keys」页面创建，最低充值约 1 元即可使用。

---

## 2. DeepSeek 模型选择（勾选你要用的）

- [ ] `deepseek-chat`（便宜，适合一般对话，推荐新手）deepseek-v4-pro
- [ ] `deepseek-reasoner`（推理更强，稍贵，回答更深度）deepseek-v4-pro

---

## 3. Vercel 部署信息

| 项目 | 值 |
|------|----|
| 部署方式 | [ ] GitHub 仓库 / [ ] 手动 CLI 部署 |
| 域名偏好 | 默认 `xxx.vercel.app`（免费） / 自定义域名：________ |

> 如果选 GitHub 仓库，请提供仓库地址：________

---

## 4. 可选：Supabase（数据持久化，非必须）

| 项目 | 值 |
|------|----|
| 是否需要 | [ ] 需要 / [ ] 暂时不需要 |
| Project URL | ________ |
| Anon Key | ________ |

> 目前项目用 localStorage 保存数据，Supabase 是后续扩展。

---

## 总结：最小可运行配置

你只需要完成 **第 1 项**（DeepSeek API Key）和选择 **第 2 项**（模型），我就可以开始创建后端函数并部署。

其他项可以后续再补。
