import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { BarChart3 } from 'lucide-react';

const BRAND = '丹尼尔的笔记库';
const HOME_LABEL = '返回首页';
const NAV_LABEL = '文章分类';

const navItems = [
  { id: 'work', label: '工作心得' },
  { id: 'learning', label: '学习分享' },
  { id: 'growth', label: '个人成长' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActive('');
      return;
    }
    const sections = navItems
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [isHome]);

  const goToSection = (id: string) => {
    if (!isHome) {
      navigate('/');
      window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        80
      );
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`nav-pill${scrolled ? ' is-scrolled' : ''}`}>
      <Link to="/" className="brand" aria-label={HOME_LABEL}>
        <span className="brand__mark"><BarChart3 size={16} /></span>
        <span>{BRAND}</span>
      </Link>
      <nav className="nav-pill__nav" aria-label={NAV_LABEL}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={active === item.id ? 'is-active' : ''}
            onClick={() => goToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
