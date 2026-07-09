import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, BookOpen, BriefcaseBusiness, ChartNoAxesCombined, GraduationCap, LineChart, UserRound } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articles, categoryMeta, featuredArticles, getArticlesByCategory } from '@/data/articles';
import type { Article } from '@/types';

const BRAND = '\u4e39\u5c3c\u5c14\u7684\u7b14\u8bb0\u4ed3\u5e93';
const HERO_COPY = '\u7528\u7814\u62a5\u5f0f\u7ed3\u6784\u8bb0\u5f55\u5de5\u4f5c\u590d\u76d8\u3001\u5b66\u4e60\u8f93\u5165\u548c\u4e2a\u4eba\u6210\u957f\u3002\u5c11\u4e00\u70b9\u88c5\u9970\uff0c\u591a\u4e00\u70b9\u6e05\u695a\u7684\u5224\u65ad\u3001\u65b9\u6cd5\u548c\u53ef\u590d\u7528\u7684\u7ed3\u8bba\u3002';
const BLOG_OVERVIEW = '\u535a\u5ba2\u6982\u89c8';
const ARTICLES_LABEL = '\u7bc7\u6587\u7ae0';
const SECTIONS_LABEL = '\u4e2a\u677f\u5757';
const LOCAL_IMAGES_LABEL = '\u672c\u5730\u914d\u56fe';
const FEATURED_ARTICLE = '\u7cbe\u9009\u6587\u7ae0';
const LATEST_SIGNAL = '\u8fd1\u671f\u89c2\u5bdf';
const IMAGE_SUFFIX = '\u914d\u56fe';

const categoryIcons = {
  work: BriefcaseBusiness,
  learning: GraduationCap,
  growth: UserRound,
} satisfies Record<Article['category'], typeof BriefcaseBusiness>;

function ArticleImage({ article, className, loading = 'lazy' }: { article: Article; className: string; loading?: 'eager' | 'lazy' }) {
  return (
    <figure className={className}>
      <img src={article.imageSrc} alt={`${article.title}${IMAGE_SUFFIX}`} loading={loading} />
    </figure>
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
      <ArticleImage article={article} className="article-thumb" />
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
            <h1>{BRAND}</h1>
            <p>{HERO_COPY}</p>
            <div className="hero-report__stats" aria-label={BLOG_OVERVIEW}>
              <div><strong>{articles.length}</strong><span>{ARTICLES_LABEL}</span></div>
              <div><strong>3</strong><span>{SECTIONS_LABEL}</span></div>
              <div><strong>{articles.length}</strong><span>{LOCAL_IMAGES_LABEL}</span></div>
            </div>
          </div>

          <aside className="hero-brief" aria-label={FEATURED_ARTICLE}>
            <div className="hero-brief__header">
              <span>Featured Memo</span>
              <BookOpen size={18} />
            </div>
            <ArticleImage article={primary} className="article-cover" loading="eager" />
            <Link to={`/article/${primary.id}`} className="hero-brief__link">
              <span>{primary.categoryLabel}</span>
              <strong>{primary.title}</strong>
              <em>{primary.takeaway}</em>
            </Link>
          </aside>
        </section>

        <section className="insight-strip" aria-label={LATEST_SIGNAL}>
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