import { Link, useLocation, useNavigate } from 'react-router';
import { BarChart3 } from 'lucide-react';

const BRAND = '\u4e39\u5c3c\u5c14\u7684\u7b14\u8bb0\u4ed3\u5e93';
const HOME_LABEL = '\u8fd4\u56de\u9996\u9875';
const NAV_LABEL = '\u6587\u7ae0\u5206\u7c7b';

const navItems = [
  { id: 'work', label: '\u5de5\u4f5c\u5fc3\u5f97' },
  { id: 'learning', label: '\u5b66\u4e60\u5206\u4eab' },
  { id: 'growth', label: '\u4e2a\u4eba\u6210\u957f' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const goToSection = (id: string) => {
    if (!isHome) {
      navigate('/');
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label={HOME_LABEL}>
          <span className="brand__mark"><BarChart3 size={18} /></span>
          <span>{BRAND}</span>
        </Link>

        <nav className="top-nav" aria-label={NAV_LABEL}>
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => goToSection(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}