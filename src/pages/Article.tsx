import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import gsap from 'gsap';
import { articles } from '@/data/articles';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Clock, CalendarDays, Tag } from 'lucide-react';

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const article = articles.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!article || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const elements = contentRef.current!.querySelectorAll('.article-animate');
      elements.forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.08,
          ease: 'power3.out',
        });
      });
    }, contentRef.current);

    return () => ctx.revert();
  }, [article]);

  if (!article) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="text-center">
          <h1 className="font-serif-display text-4xl mb-4" style={{ color: 'var(--color-text)' }}>
            文章不存在
          </h1>
          <Link
            to="/"
            className="font-mono-label text-sm transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = articles.findIndex(a => a.id === id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const parseContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2
            key={key++}
            className="article-animate font-serif-display text-2xl md:text-3xl mt-16 mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3
            key={key++}
            className="article-animate font-serif-display text-xl md:text-2xl mt-12 mb-4"
            style={{ color: 'var(--color-text)' }}
          >
            {trimmed.slice(4)}
          </h3>
        );
      } else {
        elements.push(
          <p
            key={key++}
            className="article-animate text-base md:text-lg leading-relaxed mb-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Header />

      <main>
        <div className="relative w-full" style={{ height: '60vh' }}>
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(5,5,7,0.3) 0%, rgba(5,5,7,0.8) 70%, var(--color-bg) 100%)',
            }}
          />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-24 left-8 md:left-16 flex items-center gap-2 font-mono-label text-sm transition-colors duration-300 hover:opacity-70 interactive"
            style={{ color: 'var(--color-text)' }}
          >
            <ArrowLeft size={16} />
            返回
          </button>
        </div>

        <article
          ref={contentRef}
          className="relative max-w-3xl mx-auto px-8 md:px-16"
          style={{ marginTop: '-100px', paddingBottom: '15vh' }}
        >
          <div className="article-animate flex flex-wrap items-center gap-6 mb-8">
            <span
              className="flex items-center gap-2 font-mono-label text-xs"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              <Tag size={14} />
              {article.categoryLabel}
            </span>
            <span
              className="flex items-center gap-2 font-mono-label text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <CalendarDays size={14} />
              {article.date}
            </span>
            <span
              className="flex items-center gap-2 font-mono-label text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Clock size={14} />
              {article.readTime}
            </span>
          </div>

          <h1
            className="article-animate font-serif-display text-3xl md:text-5xl lg:text-6xl mb-12 leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            {article.title}
          </h1>

          <div
            className="article-animate w-full h-px mb-12"
            style={{ background: 'linear-gradient(to right, var(--color-accent-teal), transparent)' }}
          />

          <div
            className="article-animate mb-16 p-6 rounded-lg"
            style={{
              background: 'var(--color-surface)',
              borderLeft: '3px solid var(--color-accent-teal)',
            }}
          >
            <p
              className="text-base md:text-lg italic leading-relaxed"
              style={{ color: 'var(--color-text)', fontFamily: '"Noto Serif SC", serif' }}
            >
              {article.excerpt}
            </p>
          </div>

          <div className="article-body">
            {parseContent(article.content)}
          </div>
        </article>

        <div
          className="max-w-6xl mx-auto px-8 md:px-16"
          style={{
            borderTop: '1px solid rgba(138, 138, 138, 0.15)',
            padding: '6vh 0 10vh',
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {prevArticle ? (
              <Link
                to={`/article/${prevArticle.id}`}
                className="group interactive"
              >
                <span className="font-mono-label text-xs tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  上一篇
                </span>
                <span
                  className="font-serif-display text-lg md:text-xl transition-colors duration-300 group-hover:opacity-70"
                  style={{ color: 'var(--color-text)' }}
                >
                  ← {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextArticle ? (
              <Link
                to={`/article/${nextArticle.id}`}
                className="group text-right interactive"
              >
                <span className="font-mono-label text-xs tracking-wider block mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  下一篇
                </span>
                <span
                  className="font-serif-display text-lg md:text-xl transition-colors duration-300 group-hover:opacity-70"
                  style={{ color: 'var(--color-text)' }}
                >
                  {nextArticle.title} →
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
