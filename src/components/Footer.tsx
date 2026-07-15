const BRAND = '\u4e39\u5c3c\u5c14\u7684\u7b14\u8bb0\u4ed3\u5e93';
const FOOTER_TEXT = '\u5de5\u4f5c\u3001\u5b66\u4e60\u4e0e\u6210\u957f\u7684\u7ed3\u6784\u5316\u7b14\u8bb0\u3002';
const ICP_RECORD = '\u82cfICP2026047470\u53f7-1';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{BRAND}</strong>
        <span>{FOOTER_TEXT}</span>
        <a
          className="site-footer__record"
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
        >
          {ICP_RECORD}
        </a>
      </div>
      <a href="https://github.com/DanielZhangzyj" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </footer>
  );
}