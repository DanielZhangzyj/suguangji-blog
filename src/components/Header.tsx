import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(5, 5, 7, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-8 md:px-16 py-6">
        <Link
          to="/"
          className="font-serif-display text-xl md:text-2xl tracking-tight"
          style={{ color: 'var(--color-text)' }}
        >
          溯光记
        </Link>

        <nav className="flex items-center gap-8 md:gap-12">
          {isHome ? (
            <>
              <a
                href="#archive"
                className="font-mono-label text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}
              >
                归档
              </a>
              <a
                href="#about"
                className="font-mono-label text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}
              >
                关于
              </a>
            </>
          ) : (
            <>
              <Link
                to="/#archive"
                className="font-mono-label text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}
              >
                归档
              </Link>
              <Link
                to="/#about"
                className="font-mono-label text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}
              >
                关于
              </Link>
            </>
          )}
          <a
            href="#subscribe"
            className="font-mono-label text-xs md:text-sm uppercase tracking-widest transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            订阅
          </a>
        </nav>
      </div>
    </header>
  );
}
