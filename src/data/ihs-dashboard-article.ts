import type { Article } from '@/types';
import content from './articles/ihs-dashboard-development.md?raw';

export const ihsDashboardArticle: Article = {
  id: 'ihs-dashboard-from-excel-to-cloudflare',
  imageSrc: '/article-images/ihs-dashboard-development.png',
  title: '从 Excel 到全球数据看板：IHS 汽车产量项目开发与运维全复盘',
  excerpt: '从两份汽车产量预测 Excel 出发，完整拆解 ETL、SQLite/D1 数据库、联动筛选、ECharts 可视化、Cloudflare 部署、GitHub 版本管理与月度蓝绿更新流程。',
  content,
  category: 'learning',
  categoryLabel: '学习分享',
  date: '2026-07-21',
  readTime: '20 分钟',
  metric: '428,803 条有效记录',
  signal: 'China 88,151 条、Global 340,652 条；本地完整性校验与 17 项回归测试全部通过。',
  takeaway: '数据看板的真正交付不是页面上线，而是让数据解析、数据库、测试、部署和回滚成为每个月都能安全重跑的标准流程。',
  tags: ['数据看板', 'Python ETL', 'Cloudflare D1', 'ECharts', '项目复盘'],
  featured: true,
};
