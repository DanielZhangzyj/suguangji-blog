import { Fragment, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, CalendarDays, Clock, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { articles, categoryMeta } from '@/data/articles';

function renderInline(value: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(\x60[^\x60]+\x60|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(value))) {
    if (match.index > cursor) parts.push(<Fragment key={key++}>{value.slice(cursor, match.index)}</Fragment>);
    const token = match[0];
    if (token.startsWith('\x60')) {
      parts.push(<code className="inline-code" key={key++}>{token.slice(1, -1)}</code>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        parts.push(<a href={link[2]} target="_blank" rel="noreferrer" key={key++}>{link[1]}</a>);
      }
    }
    cursor = match.index + token.length;
  }
  if (cursor < value.length) parts.push(<Fragment key={key++}>{value.slice(cursor)}</Fragment>);
  return parts;
}

function ArticleContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const value = lines[index].trim();
    if (!value) {
      index += 1;
      continue;
    }
    if (value.startsWith('\x60\x60\x60')) {
      const language = value.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('\x60\x60\x60')) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(<pre key={blocks.length}><code data-language={language}>{code.join('\n')}</code></pre>);
      continue;
    }
    if (value.startsWith('### ')) {
      blocks.push(<h3 key={blocks.length}>{renderInline(value.slice(4))}</h3>);
      index += 1;
      continue;
    }
    if (value.startsWith('## ')) {
      blocks.push(<h2 key={blocks.length}>{renderInline(value.slice(3))}</h2>);
      index += 1;
      continue;
    }
    if (/^[-*]\s+/.test(value)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      blocks.push(<ul key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\.\s+/.test(value)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }
      blocks.push(<ol key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>);
      continue;
    }
    blocks.push(<p key={blocks.length}>{renderInline(value)}</p>);
    index += 1;
  }

  return <div className="article-content">{blocks}</div>;
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

            <figure className="article-hero-image">
              <img src={article.imageSrc} alt={`${article.title}配图`} />
            </figure>

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
