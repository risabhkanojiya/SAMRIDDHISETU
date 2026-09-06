'use client';

import Link from 'next/link';
import { Search, FileCheck, MapPin, Calculator, Shield, Mic, ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { CombinedScrollSequence } from '@/components/ScrollAnimations';
import { AsciiObject } from '@/components/canvasui/AsciiObject';


const features = [
  {
    icon: Sparkles,
    title: 'AI Scheme Recommender',
    desc: 'Answer 4 simple questions. Our AI matches you to the perfect NSFDC credit scheme instantly.',
    href: '/recommend',
    color: 'from-[#013e4e] to-[#1a6b80]',
    glow: 'violet' as const,
  },
  {
    icon: Calculator,
    title: 'EMI Calculator',
    desc: 'Visualize monthly payments with dynamic sliders. Accounts for moratorium periods and scheme rates.',
    href: '/results',
    color: 'from-amber-400 to-orange-500',
    glow: 'gold' as const,
  },
  {
    icon: MapPin,
    title: 'Partner Locator',
    desc: 'Find the nearest SCA, RRB, or NBFC-MFI on an interactive map. Filters out high-NPA partners.',
    href: '/locator',
    color: 'from-blue-500 to-cyan-500',
    glow: 'none' as const,
  },
  {
    icon: Shield,
    title: 'Smart Digi-Vault',
    desc: 'Upload KYC documents once. Auto-attached to your application when you apply for a scheme.',
    href: '/vault',
    color: 'from-emerald-500 to-teal-600',
    glow: 'none' as const,
  },
];

const steps = [
  { num: '01', title: 'Choose Language', desc: 'Select Hindi, English, or use voice input' },
  { num: '02', title: 'Answer 4 Questions', desc: 'Income, project type, cost & education' },
  { num: '03', title: 'Get Matched', desc: 'AI recommends the best scheme for you' },
  { num: '04', title: 'Apply Digitally', desc: 'Auto-route to nearest eligible partner' },
];

const stats = [
  { value: 100, suffix: '+', label: 'Channel Partners' },
  { value: 6, suffix: '', label: 'Credit Schemes' },
  { value: 50, prefix: '₹', suffix: 'L', label: 'Max Loan Amount' },
  { value: 6.5, suffix: '%', label: 'Starting Interest' },
];

export default function Home() {
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
              NSFDC Digital Platform — Powered by AI
            </div>

            {/* Main Heading */}
            <h1 className="text-[4rem] sm:text-[5rem] lg:text-[6rem] font-medium leading-[1.05] tracking-tight text-[#272727] mb-6">
              Samriddhi<span className="text-[#013e4e]">Setu</span>
            </h1>

            <p className="text-xl lg:text-2xl text-[#272727] mb-4 max-w-lg leading-relaxed font-semibold">
              Intelligent financial assistance for{' '}
              <span className="text-[#013e4e]">Scheduled Caste</span> beneficiaries.
            </p>

            <p className="text-base lg:text-lg text-[#5a5a5a] mb-10 max-w-md leading-relaxed font-normal">
              Do more with less using the only platform that delivers AI-powered scheme discovery, EMI projections, and geo-spatial routing at every step.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Link href="/recommend" className="bg-[#013e4e] text-white px-7 py-3.5 rounded-[30px] font-medium text-base hover:bg-[#012d39] transition-colors shadow-sm w-full sm:w-auto text-center flex items-center justify-center gap-2">
                Find Your Scheme <ArrowRight size={16} />
              </Link>
              <Link href="/locator" className="bg-[#f4f4f1] text-[#272727] px-7 py-3.5 rounded-[30px] font-medium text-base border border-[#d1d1d1] hover:bg-white transition-colors flex justify-center items-center gap-2 shadow-sm w-full sm:w-auto">
                <MapPin size={16} /> Locate Partner
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
        line1="Everything you need,"
        line2="one platform."
        subtitle="From scheme discovery to application submission — seamlessly connected modules designed for rural and semi-urban users."
        features={features}
      />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative py-24 px-4 bg-[#013e4e]">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#f4f4f1]">
              Apply in{' '}
              <span className="text-amber-400">4 simple steps</span>
            </h2>
            <p className="text-[#f4f4f1]/60 max-w-xl mx-auto">
              No paperwork. No bank visits. Complete your entire application digitally in under 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="p-6 relative overflow-hidden group bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-[14px] hover:bg-white/[0.14] transition-all duration-200 hover:-translate-y-1">
                {/* Step number background */}
                <div className="absolute -top-4 -right-2 text-7xl font-black text-white/[0.04] group-hover:text-white/[0.08] transition-colors duration-500">
                  {step.num}
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-bold text-amber-400 mb-3 tracking-widest">
                    STEP {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-[#f4f4f1] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#f4f4f1]/60">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
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
                Ready to find your <span className="gradient-text-gold">scheme</span>?
              </h2>
              <p className="text-[#5a5a5a] mb-8 max-w-lg mx-auto">
                Join thousands of SC beneficiaries who have discovered their eligible NSFDC credit schemes digitally.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/recommend" className="btn-gold flex items-center gap-2 !px-8 !py-3">
                  <Search size={18} />
                  Start Scheme Finder
                </Link>
                <Link href="/vault" className="btn-ghost flex items-center gap-2 !px-8 !py-3">
                  <FileCheck size={18} />
                  Upload Documents
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
