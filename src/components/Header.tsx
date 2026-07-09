import { Link, useLocation, useNavigate } from 'react-router';
import { BarChart3 } from 'lucide-react';

const navItems = [
  { id: 'work', label: '工作心得' },
  { id: 'learning', label: '学习分享' },
  { id: 'growth', label: '个人成长' },
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
        <Link to="/" className="brand" aria-label="返回首页">
          <span className="brand__mark"><BarChart3 size={18} /></span>
          <span>丹尼尔的笔记仓库</span>
        </Link>

        <nav className="top-nav" aria-label="文章分类">
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
