# 丹尼尔的笔记仓库

工作心得、学习分享与个人成长的结构化博客。页面采用蓝色研报风格，弱化动效，文章按三个板块归档。

## 在线访问

- 腾讯云 CloudBase 静态托管：https://personalblog-d7ggzu6pz6dc10743-1321560445.tcloudbaseapp.com/
- 原 Cloudflare Pages（待下线）：https://danielsdailynote.pages.dev
- 项目来源仓库：https://github.com/DanielZhangzyj/suguangji-blog

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

当前站点部署在**腾讯云 CloudBase 静态托管**（环境 `personalblog-d7ggzu6pz6dc10743`，上海地域，体验版）。

- 构建：`npm run build`，输出目录 `dist`
- 部署：将 `dist/` 下全部文件上传至 CloudBase 静态托管根目录（首页/错误页均设为 `index.html`）
- 路由：本项目使用 `HashRouter`，链接走 `#`，无需服务端 history 回退
- 控制台：https://tcb.cloud.tencent.com/dev?envId=personalblog-d7ggzu6pz6dc10743#/static-hosting