# 溯光记

> 在数字的废墟中，打捞思想的遗珠。

个人博客网站，用于记录工作感悟与学习心得。采用 React + TypeScript + Vite + Tailwind CSS 构建。

## 在线预览

[点击访问](https://dcnuusefwb3j6.ok.kimi.link)

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **动画**: GSAP + ScrollTrigger
- **路由**: React Router
- **图标**: Lucide React

## 项目结构

```
src/
├── components/        # 公共组件
│   ├── Header.tsx     # 导航栏
│   ├── Footer.tsx     # 页脚
│   └── CustomCursor.tsx # 自定义光标
├── sections/          # 页面区块
│   ├── HeroStatement.tsx   # 首屏巨幕
│   ├── FeaturedEssay.tsx   # 精选文章
│   ├── ArchiveTimeline.tsx # 时空归档
│   ├── VisualDiary.tsx     # 浮光掠影
│   └── AboutSection.tsx    # 关于我
├── pages/             # 页面
│   ├── Home.tsx       # 首页
│   └── Article.tsx    # 文章详情
├── data/              # 数据
│   └── articles.ts    # 文章数据
└── types/             # 类型定义
    └── index.ts
```

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/DanielZhangzyj/suguangji-blog.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 添加文章

在 `src/data/articles.ts` 中按照 `Article` 类型定义添加新文章即可。

## 部署到 GitHub Pages

1. 在仓库 Settings > Pages 中启用 GitHub Pages
2. 推送代码到 main 分支会自动触发部署
3. 访问 `https://danielzhangzyj.github.io/suguangji-blog`

## License

MIT
