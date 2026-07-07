import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryImages } from '@/data/articles';

gsap.registerPlugin(ScrollTrigger);

export default function VisualDiary() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const items = grid.querySelectorAll<HTMLElement>('.gallery-item');
    if (!items.length) return;

    const ctx = gsap.context(() => {
      items.forEach((item, index) => {
        const img = item.querySelector('img');
        if (!img) return;

        gsap.set(img, {
          filter: 'grayscale(100%)',
          scale: 1.1,
        });

        const parallaxAmount = (index % 3 - 1) * 40;

        gsap.to(item, {
          y: parallaxAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        gsap.to(img, {
          filter: 'grayscale(0%)',
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true,
          },
        });

        gsap.fromTo(
          item,
          {
            rotateX: 8,
            rotateY: index % 2 === 0 ? -5 : 5,
            opacity: 0,
          },
          {
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const aspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'landscape': return 'aspect-[4/3]';
      case 'wide': return 'aspect-[16/9]';
      default: return 'aspect-square';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ padding: '20vh 0', background: 'var(--color-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-8 md:px-16 mb-20">
        <span
          className="font-mono-label text-xs tracking-widest uppercase block mb-4"
          style={{ color: 'var(--color-accent-purple)' }}
        >
          Visual Diary
        </span>
        <h2
          className="font-serif-display text-4xl md:text-6xl"
          style={{ color: 'var(--color-text)' }}
        >
          浮光掠影
        </h2>
      </div>

      <div
        ref={gridRef}
        className="max-w-7xl mx-auto px-8 md:px-16"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          perspective: '1000px',
        }}
      >
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className="gallery-item relative overflow-hidden rounded-lg interactive"
            style={{
              transformStyle: 'preserve-3d',
              marginTop: index % 3 === 1 ? '40px' : index % 3 === 2 ? '-20px' : '0',
            }}
          >
            <div className={`relative overflow-hidden ${aspectRatioClass(image.aspectRatio)}`}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700"
              />

              <div
                className="absolute inset-0 flex items-end p-6 opacity-0 hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(5,5,7,0.9) 0%, transparent 60%)',
                }}
              >
                <p
                  className="font-mono-label text-xs tracking-wider"
                  style={{ color: 'var(--color-text)' }}
                >
                  {image.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
