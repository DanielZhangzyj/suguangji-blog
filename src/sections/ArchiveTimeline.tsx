import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router';
import { articles } from '@/data/articles';
import { Clock, CalendarDays } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { key: 'philosophy' as const, label: '哲学', color: '#6C2BD9' },
  { key: 'tech' as const, label: '技术', color: '#1DD3B0' },
  { key: 'life' as const, label: '生活', color: '#FF3B30' },
];

export default function ArchiveTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lanesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      lanesRef.current.forEach((lane, index) => {
        if (!lane) return;

        const items = lane.querySelectorAll('.timeline-item');
        if (!items.length) return;

        gsap.set(items, {
          opacity: 0,
          y: 60,
          rotateX: -15,
        });

        gsap.to(items, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: lane,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        const direction = index % 2 === 0 ? -1 : 1;
        gsap.to(lane, {
          x: direction * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative w-full overflow-hidden"
      style={{ padding: '20vh 0', background: 'var(--color-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16 mb-20">
        <div className="flex items-end justify-between">
          <div>
            <span
              className="font-mono-label text-xs tracking-widest uppercase block mb-4"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              Archive
            </span>
            <h2
              className="font-serif-display text-4xl md:text-6xl"
              style={{ color: 'var(--color-text)' }}
            >
              时空归档
            </h2>
          </div>
          <p
            className="hidden md:block text-sm max-w-xs text-right"
            style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}
          >
            按主题分类的文章合集，记录思考的痕迹
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {categories.map((cat, catIndex) => {
          const catArticles = articles.filter(a => a.category === cat.key);
          return (
            <div
              key={cat.key}
              ref={el => { lanesRef.current[catIndex] = el; }}
              className="relative"
              style={{
                transform: `translateX(${catIndex % 2 === 0 ? '0' : '-50px'})`,
              }}
            >
              <div className="max-w-6xl mx-auto px-8 md:px-16 mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span
                    className="font-mono-label text-sm tracking-wider"
                    style={{ color: cat.color }}
                  >
                    {cat.label}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: `${cat.color}20` }}
                  />
                </div>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-4 px-8 md:px-16 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {catArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="timeline-item flex-shrink-0 group interactive"
                    style={{
                      width: '380px',
                      transformStyle: 'preserve-3d',
                      perspective: '800px',
                    }}
                  >
                    <div
                      className="relative overflow-hidden rounded-lg transition-all duration-500"
                      style={{
                        background: 'var(--color-surface)',
                        border: `1px solid ${cat.color}15`,
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        style={{ aspectRatio: '16/10' }}
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(135deg, ${cat.color}20, transparent)`,
                          }}
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className="flex items-center gap-1.5 font-mono-label text-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            <CalendarDays size={12} />
                            {article.date}
                          </span>
                          <span
                            className="flex items-center gap-1.5 font-mono-label text-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            <Clock size={12} />
                            {article.readTime}
                          </span>
                        </div>

                        <h3
                          className="font-serif-display text-xl mb-3 leading-snug transition-colors duration-300"
                          style={{ color: 'var(--color-text)' }}
                        >
                          {article.title}
                        </h3>

                        <p
                          className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
