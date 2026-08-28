'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/translations';

const navLinkKeys = [
  { href: '#marche', key: 'navMarket' as const },
  { href: '#solutions', key: 'navSolutions' as const },
  { href: '#apropos', key: 'navAbout' as const },
  { href: '#formules', key: 'navPlans' as const },
  { href: '#equipe', key: 'navTeam' as const },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangSelect = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md w-full px-4 sm:px-6 md:px-10 lg:px-20 py-3 md:py-4 z-[60] shadow-sm border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex-shrink-0 min-w-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Image
            src="/images/logo_mw.png"
            alt="MobileWallet"
            width={150}
            height={150}
            className="h-9 sm:h-10 md:h-12 lg:h-14 w-auto"
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinkKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-black text-sm lg:text-[15px] font-medium hover:text-[#F9A825] hover:underline underline-offset-4 transition-colors duration-200 whitespace-nowrap"
            >
              {t.header[link.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Sélecteur de langue */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#F9A825] hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              aria-label="Changer la langue"
              aria-expanded={langDropdownOpen}
              aria-haspopup="true"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="uppercase">{language}</span>
              <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 py-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button
                  type="button"
                  onClick={() => handleLangSelect('fr')}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium rounded-md transition-colors ${
                    language === 'fr' ? 'bg-[#F9A825]/20 text-[#F9A825]' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Français
                </button>
                <button
                  type="button"
                  onClick={() => handleLangSelect('en')}
                  className={`w-full px-4 py-2.5 text-left text-sm font-medium rounded-md transition-colors ${
                    language === 'en' ? 'bg-[#F9A825]/20 text-[#F9A825]' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>
          <Link
            href="#contact"
            className="hidden sm:flex items-center justify-center bg-[#F9A825] text-white font-semibold px-4 py-2 md:px-5 md:py-2.5 rounded-lg hover:bg-[#F57C00] hover:scale-105 transition-all duration-200 text-sm whitespace-nowrap shrink-0"
          >
            {t.header.contactBtn}
          </Link>
          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 px-4 text-black font-medium hover:bg-[#F9A825]/10 hover:text-[#F9A825] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.header[link.key]}
              </Link>
            ))}
            <div className="flex gap-2 mt-2 py-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { setLanguage('fr'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${language === 'fr' ? 'bg-[#F9A825] text-black' : 'bg-gray-100 text-gray-700'}`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${language === 'en' ? 'bg-[#F9A825] text-black' : 'bg-gray-100 text-gray-700'}`}
              >
                EN
              </button>
            </div>
            <Link
              href="#contact"
              className="mt-2 sm:hidden w-full bg-[#F9A825] text-white font-semibold py-3 rounded-lg hover:bg-black transition-colors text-center block"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.header.contactBtn}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
