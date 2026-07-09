import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, CalendarDays, Clock, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articles, categoryMeta } from '@/data/articles';

function ArticleContent({ content }: { content: string }) {
  return (
    <div className="article-content">
      {content.split('\n').map((line, index) => {
        const value = line.trim();
        if (!value) return null;
        if (value.startsWith('## ')) return <h2 key={index}>{value.slice(3)}</h2>;
        return <p key={index}>{value}</p>;
      })}
    </div>
  );
}

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = articles.find((item) => item.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="page-shell">
        <Header />
        <main className="empty-state">
          <h1>文章不存在</h1>
          <p>这篇文章可能已经移动或还没有发布。</p>
          <Link to="/">返回首页</Link>
        </main>
      </div>
    );
  }

  const currentIndex = articles.findIndex((item) => item.id === id);
  const previous = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const next = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const meta = categoryMeta[article.category];

  return (
    <div className="page-shell">
      <Header />
      <main className="article-page">
        <button type="button" className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> 返回
        </button>

        <article className="article-layout">
          <aside className="article-sidebar">
            <div className="sidebar-panel">
              <span className="panel-label">Category</span>
              <strong style={{ color: meta.accent }}>{article.categoryLabel}</strong>
              <p>{meta.description}</p>
            </div>
            <div className="sidebar-panel">
              <span className="panel-label">Key Metric</span>
              <strong>{article.metric}</strong>
              <p>{article.signal}</p>
            </div>
          </aside>

          <div className="article-main">
            <div className="article-meta">
              <span><Tag size={15} /> {article.categoryLabel}</span>
              <span><CalendarDays size={15} /> {article.date}</span>
              <span><Clock size={15} /> {article.readTime}</span>
            </div>
            <h1>{article.title}</h1>
            <p className="article-deck">{article.excerpt}</p>

            <div className="takeaway-box">
              <span>核心结论</span>
              <strong>{article.takeaway}</strong>
            </div>

            <ArticleContent content={article.content} />
          </div>
        </article>

        <nav className="article-pager" aria-label="文章翻页">
          {previous ? <Link to={`/article/${previous.id}`}>上一篇：{previous.title}</Link> : <span />}
          {next ? <Link to={`/article/${next.id}`}>下一篇：{next.title}</Link> : <span />}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
