import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  ChartNoAxesCombined,
  Github,
  BriefcaseBusiness,
  GraduationCap,
  UserRound,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LetterGlitch from '@/components/LetterGlitch';
import { articles, categoryMeta, featuredArticles, getArticlesByCategory } from '@/data/articles';
import type { Article } from '@/types';

const LATEST_SIGNAL = '近期观察';

const categoryIcons = {
  work: BriefcaseBusiness,
  learning: GraduationCap,
  growth: UserRound,
} satisfies Record<Article['category'], typeof BriefcaseBusiness>;

const ALL_TAGS = Array.from(new Set(articles.flatMap((a) => a.tags)));

function TagTicker() {
  const loop = [...ALL_TAGS, ...ALL_TAGS];
  return (
    <section className="ticker" aria-label="文章标签">
      <div className="ticker__fade ticker__fade--left" />
      <div className="ticker__fade ticker__fade--right" />
      <div className="ticker__track">
        {loop.map((tag, i) => (
          <span key={i} className="ticker__item">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/article/${article.id}`} className="article-card">
      <div className="article-card__media">
        <img src={article.imageSrc} alt={`${article.title} 封面`} loading="lazy" />
        <span className="article-card__cat">{article.categoryLabel}</span>
      </div>
      <div className="article-card__body">
        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__excerpt">{article.excerpt}</p>
        <div className="article-card__meta">
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
        <div className="tag-list">
          {article.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
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
          <span className="section-kicker shiny">
            <Icon size={16} /> {meta.label}
          </span>
          <h2>{meta.label}</h2>
        </div>
        <p>{meta.description}</p>
      </div>
      <div className="article-list">
        {items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const secondary = featuredArticles[1] ?? articles[2];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="page-shell">
      <Header />
      <main>
        <section className="hero" id="home">
          <div className="hero__copy">
            <p className="eyebrow shiny">Research Notes · 2026</p>
            <h1 className="hero__title">
              把工作复盘、<br />
              学习方法<br />
              写进<span className="shiny"> 我的地盘</span>
            </h1>
            <p className="hero__lead">
              用研究式结构记录工作复盘、学习输入和个人成长。多
              <span className="shiny">一点装饰</span>
              ，多一份清晰的判断、方法和可复用的结论。
            </p>
            <div className="hero__actions">
              <button type="button" className="btn btn--primary" onClick={() => scrollTo('work')}>
                浏览文章 <ArrowRight size={16} />
              </button>
              <a
                className="btn btn--ghost"
                href="https://github.com/DanielZhangzyj"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>
          <div className="hero__glitch" aria-hidden="true">
            <LetterGlitch />
          </div>
        </section>

        <TagTicker />

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
