import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router';
import { articles } from '@/data/articles';
import { Clock, CalendarDays, Tag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedEssay() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const featured = articles.find(a => a.featured) || articles[0];

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !image || !content) return;

    const ctx = gsap.context(() => {
      gsap.from(image, {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(content, {
        x: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ padding: '15vh 0', background: 'var(--color-bg)' }}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div
            ref={imageRef}
            className="w-full lg:w-[60%] relative overflow-hidden rounded-lg interactive"
            style={{ aspectRatio: '3/2' }}
          >
            <Link to={`/article/${featured.id}`}>
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,7,0.4) 100%)',
                }}
              />
            </Link>
          </div>

          <div
            ref={contentRef}
            className="w-full lg:w-[40%] flex flex-col justify-center"
          >
            <div className="flex items-center gap-6 mb-6">
              <span className="flex items-center gap-2 font-mono-label text-xs" style={{ color: 'var(--color-accent-teal)' }}>
                <Tag size={14} />
                {featured.categoryLabel}
              </span>
              <span className="flex items-center gap-2 font-mono-label text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <CalendarDays size={14} />
                {featured.date}
              </span>
              <span className="flex items-center gap-2 font-mono-label text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={14} />
                {featured.readTime}
              </span>
            </div>

            <Link to={`/article/${featured.id}`}>
              <h2
                className="font-serif-display text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight transition-colors duration-300 hover:opacity-80"
                style={{ color: 'var(--color-text)' }}
              >
                {featured.title}
              </h2>
            </Link>

            <div className="relative">
              <p
                className="text-base md:text-lg leading-relaxed italic"
                style={{
                  color: 'var(--color-text-muted)',
                  fontFamily: '"Noto Serif SC", serif',
                }}
              >
                <span
                  className="float-left mr-3 mt-1 font-serif-display not-italic"
                  style={{
                    fontSize: '3.5rem',
                    lineHeight: 0.8,
                    color: 'var(--color-accent-teal)',
                  }}
                >
                  {featured.excerpt.charAt(0)}
                </span>
                {featured.excerpt.slice(1)}
              </p>
            </div>

            <Link
              to={`/article/${featured.id}`}
              className="mt-8 inline-flex items-center gap-3 font-mono-label text-sm tracking-wider transition-all duration-300 group"
              style={{ color: 'var(--color-accent-teal)' }}
            >
              阅读全文
              <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
