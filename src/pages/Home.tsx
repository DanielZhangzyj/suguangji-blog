import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, BookOpen, BriefcaseBusiness, ChartNoAxesCombined, GraduationCap, LineChart, UserRound } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articles, categoryMeta, featuredArticles, getArticlesByCategory } from '@/data/articles';
import type { Article } from '@/types';

const categoryIcons = {
  work: BriefcaseBusiness,
  learning: GraduationCap,
  growth: UserRound,
} satisfies Record<Article['category'], typeof BriefcaseBusiness>;

function ReportVisual({ article }: { article: Article }) {
  return (
    <div className={`report-visual report-visual--${article.category}`} aria-hidden="true">
      <div className="report-visual__topline">
        <span>{article.categoryLabel}</span>
        <span>{article.date.slice(5)}</span>
      </div>
      <div className="report-visual__metric">{article.metric}</div>
      <div className="report-visual__grid">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="report-visual__bars">
        <span style={{ height: '48%' }} />
        <span style={{ height: '72%' }} />
        <span style={{ height: '56%' }} />
        <span style={{ height: '86%' }} />
        <span style={{ height: '64%' }} />
      </div>
    </div>
  );
}

function ArticleRow({ article, index }: { article: Article; index: number }) {
  return (
    <Link to={`/article/${article.id}`} className="article-row">
      <div className="article-row__index">{String(index + 1).padStart(2, '0')}</div>
      <div className="article-row__main">
        <div className="article-row__meta">
          <span>{article.categoryLabel}</span>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="tag-list">
          {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </div>
      <ReportVisual article={article} />
      <ArrowUpRight className="article-row__arrow" size={20} />
    </Link>
  );
}

function CategorySection({ category }: { category: Article['category'] }) {
  const Icon = categoryIcons[category];
  const items = getArticlesByCategory(category);
  const meta = categoryMeta[category];

  return (
    <section id={category} className="category-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker"><Icon size={16} /> {meta.label}</span>
          <h2>{meta.label}</h2>
        </div>
        <p>{meta.description}</p>
      </div>
      <div className="article-list">
        {items.map((article, index) => <ArticleRow key={article.id} article={article} index={index} />)}
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const primary = featuredArticles[0] ?? articles[0];
  const secondary = featuredArticles[1] ?? articles[2];

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="hero-report">
          <div className="hero-report__copy">
            <span className="eyebrow"><LineChart size={16} /> Research Notes / 2026</span>
            <h1>丹尼尔的笔记仓库</h1>
            <p>
              用研报式结构记录工作复盘、学习输入和个人成长。少一点装饰，多一点清楚的判断、方法和可复用的结论。
            </p>
            <div className="hero-report__stats" aria-label="博客概览">
              <div><strong>{articles.length}</strong><span>篇文章</span></div>
              <div><strong>3</strong><span>个板块</span></div>
              <div><strong>0</strong><span>外链图片依赖</span></div>
            </div>
          </div>

          <aside className="hero-brief" aria-label="精选文章">
            <div className="hero-brief__header">
              <span>Featured Memo</span>
              <BookOpen size={18} />
            </div>
            <ReportVisual article={primary} />
            <Link to={`/article/${primary.id}`} className="hero-brief__link">
              <span>{primary.categoryLabel}</span>
              <strong>{primary.title}</strong>
              <em>{primary.takeaway}</em>
            </Link>
          </aside>
        </section>

        <section className="insight-strip" aria-label="近期观察">
          <div>
            <span>Latest Signal</span>
            <strong>{secondary.signal}</strong>
          </div>
          <ChartNoAxesCombined size={24} />
        </section>

        <CategorySection category="work" />
        <CategorySection category="learning" />
        <CategorySection category="growth" />
      </main>
      <Footer />
    </div>
  );
}
