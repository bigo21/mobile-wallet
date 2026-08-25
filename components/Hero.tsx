'use client';

import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full min-h-[500px] bg-gradient-to-r from-[#0D0D0D] via-[#1A1A1A] to-[#2D1B0E] overflow-hidden pt-10 md:pt-12 lg:pt-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 md:py-10 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Colonne gauche - Texte et actions */}
          <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 z-10 justify-center">
            <AnimateOnScroll animation="fade-up" delay={0} threshold={0.2}>
              {/* Titre principal */}
              <h1 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl leading-[1.2] md:leading-[1.3] lg:leading-[1.4] mb-2 md:mb-3">
                {t.hero.title}
              </h1>

              {/* Description */}
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-2 md:mb-3">
                {t.hero.subtitle}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150} threshold={0.2}>
            {/* Badges de caractéristiques */}
            <div className="flex gap-2 flex-wrap mb-2 md:mb-3">
              <span className="bg-[#1A1A1A] border-2 border-white text-white px-3 py-1 rounded-full text-xs md:text-sm hover:bg-[#2a2a2a] hover:border-[#F9A825] transition-colors duration-200 cursor-default">
                {t.hero.badgeMultiop}
              </span>
              <span className="bg-[#1A1A1A] border-2 border-white text-white px-3 py-1 rounded-full text-xs md:text-sm hover:bg-[#2a2a2a] hover:border-[#F9A825] transition-colors duration-200 cursor-default">
                {t.hero.badgeROI}
              </span>
              <span className="bg-[#1A1A1A] border-2 border-white text-white px-3 py-1 rounded-full text-xs md:text-sm hover:bg-[#2a2a2a] hover:border-[#F9A825] transition-colors duration-200 cursor-default">
                {t.hero.badgeMulti}
              </span>
            </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300} threshold={0.2}>
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 md:mt-3">
              <Link
                href="#formules"
                className="bg-[#F9A825] text-black font-bold px-5 py-3 rounded-lg hover:bg-[#F57C00] hover:scale-[1.03] transition-all duration-200 text-sm sm:text-base text-center shadow-lg hover:shadow-xl"
              >
                {t.hero.ctaPlans}
              </Link>
            </div>
            </AnimateOnScroll>
          </div>

          {/* Colonne droite - Image GAB */}
          <AnimateOnScroll animation="slide-in-right" delay={100} threshold={0.05}>
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image du GAB */}
              <div className="relative w-full max-w-[500px] h-full max-h-[700px] flex items-center justify-center">
                <Image
                  src="/images/34045da3c91645c7ad121d8ca1ab262f-removebg-preview.png"
                  alt={t.hero.altGAB}
                  width={500}
                  height={700}
                  className="w-full h-full object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
