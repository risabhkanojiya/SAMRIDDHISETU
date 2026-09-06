'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Search, FolderOpen, MapPin, Calculator, LogIn } from 'lucide-react';
import { useTranslation, Locale } from '@/lib/I18nProvider';

const getNavLinks = (t: (key: string) => string) => [
  { href: '/', label: t('nav.home'), icon: Search },
  { href: '/recommend', label: t('nav.recommender'), icon: Search },
  { href: '/results', label: t('nav.calculator'), icon: Calculator },
  { href: '/locator', label: t('nav.locator'), icon: MapPin },
  { href: '/vault', label: t('nav.vault'), icon: FolderOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useTranslation();
  const navLinks = getNavLinks(t);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-4 left-4 right-4 max-w-[1400px] mx-auto z-50 transition-all duration-300 rounded-full ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border border-[#e5e7eb] shadow-sm'
          : 'bg-white/60 backdrop-blur-md border border-[#e5e7eb] shadow-sm'
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-[#d1d1d1] flex items-center justify-center text-[#272727] font-bold text-xs bg-white shadow-sm transition-shadow">
              SS
            </div>
            <span className="text-lg font-medium text-[#272727] hidden sm:block tracking-tight">
              {t('nav.logo')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#013e4e]/10 text-[#013e4e]'
                      : 'text-[#5a5a5a] hover:text-[#272727] hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#5a5a5a] hover:text-[#272727] hover:bg-black/5 transition-all border border-transparent hover:border-[#e5e7eb]"
              title="Switch Language"
            >
              <Globe size={14} />
              {locale === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden sm:flex items-center justify-center bg-[#013e4e] text-white rounded-full text-[13px] font-medium hover:bg-[#012d39] transition-colors shadow-sm !py-1.5 !px-4"
            >
              {t('nav.login')}
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-[#5a5a5a] hover:text-[#272727] hover:bg-black/5 transition-all"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl border border-[#e5e7eb] mx-4 mb-4 mt-2 rounded-2xl p-3 space-y-1 shadow-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#013e4e]/10 text-[#013e4e]'
                    : 'text-[#5a5a5a] hover:text-[#272727] hover:bg-black/5'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#013e4e] text-white hover:bg-[#012d39] transition-all"
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
