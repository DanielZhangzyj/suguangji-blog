import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, MapPin, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: '制造业战略规划', level: 95 },
  { name: '数据分析 (DuckDB/Python)', level: 85 },
  { name: 'B2B 销售管理', level: 90 },
  { name: 'AI/LLM 应用学习', level: 75 },
  { name: '产业研究与市场调研', level: 88 },
  { name: '团队管理与赋能', level: 82 },
];

const experiences = [
  {
    icon: Briefcase,
    title: '销售负责人',
    org: '工程机械 / 商用车事业部',
    period: '2019 - 至今',
    desc: '负责多省区销售业务，管理覆盖重卡、工程机械等领域的B2B销售团队',
  },
  {
    icon: TrendingUp,
    title: '战略规划与产业分析',
    org: '企业战略部',
    period: '2016 - 2019',
    desc: '主导第二工厂选址项目，建立省级产业评估框架',
  },
  {
    icon: GraduationCap,
    title: '持续学习',
    org: 'AI / 数据科学',
    period: '2024 - 至今',
    desc: '系统学习DuckDB、Python数据分析、大语言模型原理与应用',
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const elements = content.querySelectorAll('.about-animate');

      elements.forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      const skillBars = content.querySelectorAll('.skill-bar-fill');
      skillBars.forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
        gsap.set(bar, { transformOrigin: 'left center' });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full"
      style={{ padding: '20vh 0', background: 'var(--color-bg)' }}
    >
      <div ref={contentRef} className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="about-animate mb-20">
          <span
            className="font-mono-label text-xs tracking-widest uppercase block mb-4"
            style={{ color: 'var(--color-accent-teal)' }}
          >
            About
          </span>
          <h2
            className="font-serif-display text-4xl md:text-6xl mb-8"
            style={{ color: 'var(--color-text)' }}
          >
            关于我
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="about-animate mb-12">
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={18} style={{ color: 'var(--color-accent-teal)' }} />
                <span className="font-mono-label text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  中国
                </span>
              </div>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: 'var(--color-text)' }}
              >
                我是一名制造业领域的战略规划与销售人员，专注于工程机械和商用车行业。在过去十年中，我从一线销售做起，逐步成长为负责多省区业务的销售负责人。
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                近年来，我开始系统性地学习数据分析和人工智能技术，试图在传统的制造业中寻找技术与业务的结合点。我相信，数据思维和AI工具能够为传统行业的决策者们打开新的视野。
              </p>
            </div>

            <div className="about-animate">
              <h3
                className="font-mono-label text-xs tracking-widest uppercase mb-6"
                style={{ color: 'var(--color-text-muted)' }}
              >
                技能领域
              </h3>
              <div className="space-y-5">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: 'var(--color-text)' }}>
                        {skill.name}
                      </span>
                      <span
                        className="font-mono-label text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ background: 'rgba(138, 138, 138, 0.15)' }}
                    >
                      <div
                        className="skill-bar-fill h-full rounded-full"
                        data-width={skill.level}
                        style={{
                          width: `${skill.level}%`,
                          background: 'linear-gradient(90deg, var(--color-accent-teal), var(--color-accent-purple))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3
              className="about-animate font-mono-label text-xs tracking-widest uppercase mb-8"
              style={{ color: 'var(--color-text-muted)' }}
            >
              经历
            </h3>
            <div className="space-y-10">
              {experiences.map((exp) => (
                <div
                  key={exp.title}
                  className="about-animate relative pl-8"
                  style={{ borderLeft: '1px solid rgba(138, 138, 138, 0.2)' }}
                >
                  <div
                    className="absolute left-0 top-0 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-surface)', border: '1px solid rgba(138, 138, 138, 0.3)' }}
                  >
                    <exp.icon size={12} style={{ color: 'var(--color-accent-teal)' }} />
                  </div>
                  <div className="mb-2">
                    <span
                      className="font-mono-label text-xs"
                      style={{ color: 'var(--color-accent-teal)' }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <h4
                    className="font-serif-display text-lg mb-1"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {exp.title}
                  </h4>
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {exp.org}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
