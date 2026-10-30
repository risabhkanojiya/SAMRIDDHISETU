'use client';

import Link from 'next/link';
import { Search, FileCheck, MapPin, Calculator, Shield, Mic, ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { CombinedScrollSequence } from '@/components/ScrollAnimations';
import { AsciiObject } from '@/components/canvasui/AsciiObject';
import MotionButton from '@/components/ui/motion-button';
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel';
import GeometricBackground from '@/components/ui/geometric-background';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { useTranslation } from '@/lib/I18nProvider';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Sparkles,
      title: t('home.features.ai.title'),
      desc: t('home.features.ai.desc'),
      href: '/recommend',
      color: 'from-[#013e4e] to-[#1a6b80]',
      glow: 'violet' as const,
    },
    {
      icon: Calculator,
      title: t('home.features.emi.title'),
      desc: t('home.features.emi.desc'),
      href: '/results',
      color: 'from-amber-400 to-orange-500',
      glow: 'gold' as const,
    },
    {
      icon: MapPin,
      title: t('home.features.map.title'),
      desc: t('home.features.map.desc'),
      href: '/locator',
      color: 'from-blue-500 to-cyan-500',
      glow: 'none' as const,
    },
    {
      icon: Shield,
      title: t('home.features.vault.title'),
      desc: t('home.features.vault.desc'),
      href: '/vault',
      color: 'from-emerald-500 to-teal-600',
      glow: 'none' as const,
    },
  ];

  const steps = [
    { num: '01', title: t('home.steps.s1'), desc: t('home.steps.s1desc') },
    { num: '02', title: t('home.steps.s2'), desc: t('home.steps.s2desc') },
    { num: '03', title: t('home.steps.s3'), desc: t('home.steps.s3desc') },
    { num: '04', title: t('home.steps.s4'), desc: t('home.steps.s4desc') },
  ];

  const stats = [
    { value: 100, suffix: '+', label: t('home.stats.p1') },
    { value: 6, suffix: '', label: t('home.stats.p2') },
    { value: 50, prefix: '₹', suffix: 'L', label: t('home.stats.p3') },
    { value: 6.5, suffix: '%', label: t('home.stats.p4') },
  ];
  const thirdSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: thirdSectionRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="relative">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#f4f4f1] pt-24 pb-20">
        {/* Soft pastel blobs matching the reference */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-[#a7f3d0]/40 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute -top-[10%] right-[10%] w-[800px] h-[800px] bg-[#fef08a]/40 rounded-full blur-[140px] mix-blend-multiply" />
          <div className="absolute bottom-[0%] -right-[10%] w-[800px] h-[800px] bg-[#fbcfe8]/40 rounded-full blur-[150px] mix-blend-multiply" />
          <div className="absolute -bottom-[10%] left-[30%] w-[600px] h-[600px] bg-[#bae6fd]/30 rounded-full blur-[130px] mix-blend-multiply" />
          <div className="absolute top-[40%] right-[0%] w-[600px] h-[600px] bg-[#fed7aa]/40 rounded-full blur-[120px] mix-blend-multiply" />
        </div>

        {/* Background Model */}
        <div className="absolute right-[5vw] top-[11vh] w-[43vw] h-[82vh] max-w-[700px] max-h-[700px] z-0 pointer-events-none flex justify-center items-center">
          <AsciiObject
            src="/model.glb"
            className="w-full h-full object-contain mix-blend-multiply opacity-100"
            color="#272727"
            colored={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            orbit={false}
            floatIntensity={1}
            rotationIntensity={0.5}
            scale={4.5}
            cameraDistance={5}
            cellSize={6}
            contrast={0.35}
            exposure={0.5}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            {/* Badge */}
            <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#e5e7eb] text-xs font-semibold text-[#4b5563] mb-8 shadow-sm">
              <Sparkles size={14} className="text-[#013e4e]" />
              {t('home.badge')}
            </div>

            {/* Main Heading */}
            <h1 className="text-[4rem] sm:text-[5rem] lg:text-[6rem] font-medium leading-[1.05] tracking-tight text-[#272727] mb-6">
              {t('home.title')}<span className="text-[#013e4e]">{t('home.titleHighlight')}</span>
            </h1>

            <p className="text-xl lg:text-2xl text-[#272727] mb-4 max-w-lg leading-relaxed font-semibold">
              {t('home.subtitle')}
              <span className="text-[#013e4e]">{t('home.subtitleHighlight')}</span>{t('home.subtitleEnd')}
            </p>

            <p className="text-base lg:text-lg text-[#5a5a5a] mb-10 max-w-md leading-relaxed font-normal">
              {t('home.desc')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <MotionButton href="/recommend" label={t('home.cta.recommender')} classes="w-full sm:w-auto" />
              <Link href="/locator" className="btn-primary flex justify-center items-center gap-2 w-full sm:w-auto">
                <MapPin size={16} /> {t('home.cta.locator')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 text-left bg-white/80 border border-[#e5e7eb] backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-black text-[#272727] mb-1">
                    <AnimatedCounter
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      duration={2000 + i * 300}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block"></div>
        </div>
      </section>

      {/* ═══ HUMMINGBIRD-STYLE COMBINED SCROLL SEQUENCE ═══ */}
      <CombinedScrollSequence
        line1={t('home.scroll.l1')}
        line2={t('home.scroll.l2')}
        subtitle={t('home.scroll.subtitle')}
        features={features}
      />

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={thirdSectionRef} className="relative h-[300vh] bg-white">
        <div className="sticky top-0 h-screen flex flex-col justify-start overflow-hidden w-full pt-[10vh]">
          <GeometricBackground>
            <div className="max-w-5xl mx-auto relative z-10 w-full">
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-[#013e4e] uppercase tracking-widest mb-2">{t('home.steps.title')}</p>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-[#272727]">
                  {t('home.steps.title')} <span className="text-[#013e4e]">{t('home.steps.highlight')}</span>
                </h2>
                <p className="text-[#5a5a5a] max-w-xl mx-auto leading-relaxed">
                  {t('home.steps.desc')}
                </p>
              </div>

              <div className="mt-8 mb-4">
                <CoverflowCarousel
                  cardWidth="clamp(320px, 70vmin, 800px)"
                  scrollProgress={scrollYProgress}
                  slides={steps.map((step) => ({
                    src: `https://placehold.co/600x600/f4f4f1/013e4e?text=Step+${step.num}`,
                    video: `/steps/SS_STEP${parseInt(step.num, 10)}.webm`,
                    alt: step.title,
                    title: step.title,
                    subtitle: step.desc,
                    meta: [{ label: 'Step', value: step.num }]
                  }))}
                  showCaption={true}
                  showNavigation={true}
                  showPagination={true}
                />
              </div>
            </div>
          </GeometricBackground>
        </div>
      </section>
      {/* ═══ CTA FOOTER ═══ */}
      <section className="relative py-24 px-4 bg-[#f4f4f1]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 relative overflow-hidden bg-white rounded-[20px] border border-black/5 shadow-sm">
            {/* Decorative blobs */}
            <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#013e4e]/5 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] bg-amber-500/5 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-[#272727]">
                {t('home.cta2.title')} <span className="gradient-text-gold">{t('home.cta2.highlight')}</span>?
              </h2>
              <p className="text-[#5a5a5a] mb-8 max-w-lg mx-auto">
                {t('home.cta2.desc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/recommend" className="btn-gold flex items-center gap-2 !px-8 !py-3">
                  <Search size={18} />
                  {t('home.cta2.start')}
                </Link>
                <Link href="/vault" className="btn-ghost flex items-center gap-2 !px-8 !py-3">
                  <FileCheck size={18} />
                  {t('home.cta2.upload')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-8 px-4 bg-[#f4f4f1]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#5a5a5a]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#013e4e] flex items-center justify-center text-white text-[10px] font-bold">
              SS
            </div>
            SamriddhiSetu — Team Tatkal
          </div>
          <div className="flex items-center gap-1">
            <Mic size={14} />
            Powered by Bhashini, Gemini AI & PostGIS
          </div>
        </div>
      </footer>
    </div>
  );
}
