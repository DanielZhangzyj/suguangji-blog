# 丹尼尔的笔记仓库

工作心得、学习分享与个人成长的结构化博客。页面采用蓝色研报风格，弱化动效，文章按三个板块归档。

## 在线访问

- Cloudflare Pages: https://danielsdailynote.pages.dev
- 原 Pages 项目来源仓库: https://github.com/DanielZhangzyj/suguangji-blog

## 技术栈

- React 19 + TypeScript
- Vite
- React Router
- Lucide React

## 本地开发

```bash
npm install
npm run dev
npm run build
```

## 内容维护

文章数据维护在 `src/data/articles.ts`，分类固定为：

- 工作心得
- 学习分享
- 个人成长

## 部署

当前站点部署在 Cloudflare Pages，生产分支为 `main`，构建命令为 `npm run build`，输出目录为 `dist`。