import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textBlock = textRef.current;
    if (!container || !textBlock) return;

    const text = '在数字的废墟中，打捞思想的遗珠。';
    const sliceCount = 30;
    const slices: HTMLDivElement[] = [];

    textBlock.innerHTML = '';

    for (let i = 0; i < sliceCount; i++) {
      const slice = document.createElement('div');
      slice.className = 'slice absolute inset-0 flex items-center justify-center';
      slice.style.clipPath = `inset(${(i / sliceCount) * 100}% 0 ${((sliceCount - 1 - i) / sliceCount) * 100}% 0)`;
      slice.textContent = text;
      slice.style.fontSize = '12vw';
      slice.style.color = 'var(--color-text)';
      slice.style.fontFamily = '"Noto Serif SC", "Source Han Serif SC", serif';
      slice.style.fontWeight = '900';
      slice.style.letterSpacing = '-0.02em';
      slice.style.whiteSpace = 'nowrap';
      textBlock.appendChild(slice);
      slices.push(slice);
    }

    const computedStyle = window.getComputedStyle(slices[0]);
    textBlock.style.setProperty('--text-height', computedStyle.height);
    textBlock.style.setProperty('--text-width', computedStyle.width);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'center center',
        end: '+=200%',
        scrub: true,
        pin: true,
      },
    });

    slices.forEach((slice, i) => {
      const isOdd = i % 2 === 0;
      tl.fromTo(
        slice,
        {
          rotateY: 0,
          translateX: isOdd ? -1 : 1,
          translateZ: 0,
        },
        {
          rotateY: isOdd ? 75 : -75,
          translateX: isOdd ? -1 * (i + 1) : 1 * (i + 1),
          translateZ: (i + 1),
          ease: 'none',
        },
        0
      );
    });

    tl.to(container, {
      opacity: 0,
      duration: 0.3,
    }, 0.7);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-statement relative w-full flex items-center justify-center"
      style={{ height: '100vh', background: 'var(--color-bg)' }}
    >
      <div
        ref={textRef}
        className="text-block relative"
        style={{
          width: '100%',
          height: '20vw',
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      />

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span
          className="font-mono-label text-xs tracking-widest uppercase"
          style={{ color: 'var(--color-text-muted)' }}
        >
          向下滚动
        </span>
        <div
          className="w-px h-12 animate-pulse"
          style={{
            background: 'linear-gradient(to bottom, var(--color-text-muted), transparent)',
          }}
        />
      </div>
    </section>
  );
}
