import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroStatement from '@/sections/HeroStatement';
import FeaturedEssay from '@/sections/FeaturedEssay';
import ArchiveTimeline from '@/sections/ArchiveTimeline';
import VisualDiary from '@/sections/VisualDiary';
import AboutSection from '@/sections/AboutSection';

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Header />

      <main>
        <HeroStatement />
        <FeaturedEssay />
        <ArchiveTimeline />
        <VisualDiary />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
