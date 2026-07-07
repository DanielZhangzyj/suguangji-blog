import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="subscribe" className="relative w-full" style={{ padding: '20vh 0 8vh' }}>
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="text-center mb-24">
          <h2
            className="font-serif-display text-4xl md:text-6xl lg:text-7xl mb-8"
            style={{ color: 'var(--color-text)' }}
          >
            保持联系
          </h2>
          <p
            className="text-base md:text-lg max-w-xl mx-auto mb-12"
            style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}
          >
            订阅我的通讯，获取最新的工作感悟与学习心得
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full sm:flex-1 px-6 py-4 rounded-full text-sm outline-none transition-all duration-300 focus:ring-2"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid rgba(234, 234, 234, 0.1)',
              }}
            />
            <button type="submit" className="subscribe-btn">
              <span className="gradient" />
              <span className="text relative z-10 font-mono-label text-sm tracking-wider">
                {subscribed ? '已订阅 ✓' : '订阅'}
              </span>
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12" style={{ borderTop: '1px solid rgba(138, 138, 138, 0.15)' }}>
          <div className="font-mono-label text-xs" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} 溯光记. All rights reserved.
          </div>

          <div className="flex items-center gap-8">
            <a
              href="https://github.com/DanielZhangzyj"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label text-xs transition-colors duration-300 hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
            >
              GitHub
            </a>
            <a
              href="#"
              className="font-mono-label text-xs transition-colors duration-300 hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Twitter
            </a>
            <a
              href="#"
              className="font-mono-label text-xs transition-colors duration-300 hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
            >
              知乎
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
