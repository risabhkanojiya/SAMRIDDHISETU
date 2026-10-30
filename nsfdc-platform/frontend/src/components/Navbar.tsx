'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Search, FolderOpen, MapPin, Calculator, LogIn } from 'lucide-react';
import { useTranslation } from '@/lib/I18nProvider';

const navLinks = [
  { href: '/', i18nKey: 'nav.home', icon: Search },
  { href: '/recommend', i18nKey: 'nav.recommender', icon: Search },
  { href: '/results', i18nKey: 'nav.calculator', icon: Calculator },
  { href: '/locator', i18nKey: 'nav.locator', icon: MapPin },
  { href: '/vault', i18nKey: 'nav.vault', icon: FolderOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { locale, setLocale, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    setIsLoggedIn(document.cookie.includes('auth-token='));
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; max-age=0";
    window.location.href = '/login';
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-4 left-4 right-4 max-w-[1400px] mx-auto z-50 transition-all duration-300 rounded-full ${
        scrolled
          ? 'bg-white/40 backdrop-blur-2xl border border-white/60 shadow-lg shadow-black/5'
          : 'bg-white/20 backdrop-blur-xl border border-white/40 shadow-sm shadow-black/5'
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <Image 
              src="/logo.png" 
              alt="SamriddhiSetu Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 object-contain" 
            />
            <span className="text-lg font-semibold text-[#272727] hidden sm:block tracking-tight">
              SamriddhiSetu
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
                      : 'text-[#272727] hover:bg-black/5'
                  }`}
                >
                  {t(link.i18nKey)}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#272727] hover:bg-black/5 transition-all border border-transparent hover:border-[#e5e7eb]"
              title="Switch Language"
            >
              <Globe size={14} />
              {locale === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Login / Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="btn-ghost hidden sm:flex items-center justify-center shadow-sm !py-1.5 !px-4 !text-[13px] gap-2 border border-[#e5e7eb]"
              >
                <div className="w-4 h-4 rounded-full bg-[#013e4e] flex items-center justify-center text-white text-[9px] font-bold">U</div>
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="btn-primary hidden sm:flex items-center justify-center shadow-sm !py-1.5 !px-4 !text-[13px]"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-[#272727] hover:bg-black/5 transition-all"
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
                    : 'text-[#272727] hover:bg-black/5'
                }`}
              >
                <Icon size={16} />
                {t(link.i18nKey)}
              </Link>
            );
          })}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center justify-center gap-2 mt-2 !px-4 !py-2.5 w-full border border-[#e5e7eb]"
            >
              <div className="w-4 h-4 rounded-full bg-[#013e4e] flex items-center justify-center text-white text-[9px] font-bold">U</div>
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="btn-primary flex items-center justify-center gap-2 mt-2 !px-4 !py-2.5"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
