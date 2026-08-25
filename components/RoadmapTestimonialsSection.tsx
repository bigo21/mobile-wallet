'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RoadmapTestimonialsSection() {
  const { t } = useLanguage();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const roadmapPhases = [
    { period: '2020-2024', title: t.roadmap.phase1.title, status: 'completed' as const, icon: 'check', items: t.roadmap.phase1.items, badge: t.roadmap.phase1.badge, badgeIcon: 'check' },
    { period: '2020-2026', title: t.roadmap.phase2.title, status: 'in-progress' as const, icon: 'lightning', items: t.roadmap.phase2.items, badge: t.roadmap.phase2.badge, badgeIcon: 'arrow' },
    { period: '2025-2026', title: t.roadmap.phase3.title, status: 'in-progress' as const, icon: 'lightning', items: t.roadmap.phase3.items, badge: t.roadmap.phase3.badge, badgeIcon: 'arrow' },
    { period: '2027+', title: t.roadmap.phase4.title, status: 'upcoming' as const, icon: 'arrow', items: t.roadmap.phase4.items, badge: t.roadmap.phase4.badge, badgeIcon: 'arrow' },
  ];

  const testimonials = [
    { quote: t.testimonials.quote1, author: '', company: 'MTN Cameroun', logo: '/images/MTN_logo-removebg-preview.png', useLogoImage: true },
    { quote: t.testimonials.quote2, author: '', company: 'UBA Cameroun', logo: '/images/UBA_logo-removebg-preview.png', useLogoImage: true },
    { quote: t.testimonials.quote3, author: t.testimonials.authorFranchise, company: t.testimonials.companyYaounde, logo: '/images/logo_mw.png', useLogoImage: true },
  ];

  // Carte de l'Afrique : contour discret + points lumineux + lignes en pointillés
  const AfricaMap = () => (
    <svg
      viewBox="0 0 500 400"
      className="w-full h-full min-h-[400px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow-orange">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Contour Afrique (gris semi-transparent) */}
      <path
        d="M 80 80 Q 120 60 180 70 L 220 90 L 260 85 L 300 100 L 340 120 L 380 110 L 420 130 L 450 150 L 460 200 L 440 260 L 400 300 L 350 320 L 300 310 L 250 330 L 200 300 L 160 260 L 140 200 L 100 150 Z"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.5"
      />
      {/* Points lumineux orange (expansion) */}
      <circle cx="280" cy="180" r="5" fill="#F9A825" opacity="0.9" filter="url(#glow-orange)" />
      <circle cx="340" cy="200" r="5" fill="#F9A825" opacity="0.9" filter="url(#glow-orange)" />
      <circle cx="380" cy="240" r="5" fill="#F9A825" opacity="0.9" filter="url(#glow-orange)" />
      <circle cx="400" cy="280" r="5" fill="#F9A825" opacity="0.9" filter="url(#glow-orange)" />
      {/* Lignes en pointillés entre les points */}
      <line x1="280" y1="180" x2="340" y2="200" stroke="rgba(249,168,37,0.5)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="340" y1="200" x2="380" y2="240" stroke="rgba(249,168,37,0.5)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="380" y1="240" x2="400" y2="280" stroke="rgba(249,168,37,0.5)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      {/* ========== BLOC 1 : ROADMAP (design maquette) ========== */}
      <section className="w-full bg-[#0A0E1A] py-16 md:py-20 relative overflow-hidden">
        {/* Formes de fond : dégradés lumineux floutés */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-0 w-72 h-72 bg-[#F9A825]/10 rounded-full blur-[80px]" />
        </div>
        {/* Carte Afrique à droite */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] max-w-xl h-[70%] opacity-30 pointer-events-none">
          <AfricaMap />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 relative z-10">
          {/* En-tête */}
          <div className="text-center mb-14 md:mb-20">
            <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-3">
              {t.roadmap.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t.roadmap.title}
            </h2>
            <p className="text-white text-base md:text-lg max-w-3xl mx-auto">
              {t.roadmap.subtitle}
            </p>
          </div>

          {/* Timeline : ligne avec dégradé gris → orange lumineux */}
          <div className="relative">
            {/* Ligne horizontale (dégradé + lueur orange à droite) */}
            <div className="absolute left-0 right-0 top-[5.5rem] md:top-[6rem] h-1.5 -translate-y-1/2 z-0 hidden md:block">
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #475569 0%, #64748b 30%, #F9A825 70%, #F9A825 100%)',
                  boxShadow: '0 0 24px rgba(249,168,37,0.5), 0 0 48px rgba(249,168,37,0.25)',
                }}
              />
            </div>

            {/* Grille des 4 phases */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
              {roadmapPhases.map((phase, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Titre au-dessus de la ligne */}
                  <div className="text-center mb-6">
                    <p className="text-white font-bold text-base md:text-lg">{phase.period}</p>
                    <p
                      className={
                        phase.status === 'in-progress' && phase.title.startsWith('(')
                          ? 'text-white text-xs md:text-sm mt-0.5'
                          : 'text-[#F9A825] text-sm md:text-base font-medium mt-0.5'
                      }
                    >
                      {phase.title}
                    </p>
                  </div>

                  {/* Cercle sur la timeline (icône + bordure orange + lueur si in-progress/upcoming) */}
                  <div
                    className={`relative z-20 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full border-2 shrink-0 mb-6 ${
                      phase.status === 'upcoming' ? 'border-black bg-black' : phase.status === 'completed' ? 'border-white' : 'border-[#F9A825]'
                    } ${
                      phase.status === 'in-progress' ? 'bg-[#F9A825]' : phase.status === 'upcoming' ? 'bg-black' : 'bg-white'
                    }`}
                    style={
                      phase.status !== 'completed'
                        ? { boxShadow: '0 0 20px rgba(249,168,37,0.6), 0 0 40px rgba(249,168,37,0.3)' }
                        : { boxShadow: '0 0 12px rgba(249,168,37,0.4)' }
                    }
                  >
                    {phase.icon === 'check' && (
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {phase.icon === 'lightning' && (
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    {phase.icon === 'arrow' && (
                      <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>

                  {/* Carte contenu sous la timeline */}
                  <div
                    className={`w-full rounded-xl p-5 md:p-6 min-h-[200px] flex flex-col ${
                      phase.status === 'completed'
                        ? 'bg-white border border-gray-200'
                        : phase.status === 'in-progress'
                        ? 'bg-[#c77a0a] border border-[#F9A825]/50'
                        : 'bg-black border border-dashed border-[#F9A825]'
                    }`}
                    style={
                      phase.status === 'in-progress'
                        ? { boxShadow: '0 0 24px rgba(249,168,37,0.35), 0 0 48px rgba(249,168,37,0.15)' }
                        : undefined
                    }
                  >
                    <ul className="space-y-2 mb-4 flex-1">
                      {phase.items.map((item, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-2 text-sm md:text-base ${
                            phase.status === 'in-progress' || phase.status === 'upcoming' ? 'text-white' : phase.status === 'completed' ? 'text-black' : 'text-gray-600'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${phase.status === 'completed' ? 'bg-[#F9A825]' : phase.status === 'in-progress' ? 'bg-white' : 'bg-[#F9A825]'}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Bouton statut */}
                    {phase.status === 'completed' && (
                      <div className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold mt-auto w-max self-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {phase.badge}
                      </div>
                    )}
                    {phase.status === 'in-progress' && (
                      <div
                        className="inline-flex items-center justify-center gap-2 bg-white text-[#F9A825] px-3 py-2 rounded-lg text-sm font-semibold mt-auto w-max self-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {phase.badge}
                      </div>
                    )}
                    {phase.status === 'upcoming' && (
                      <div className="inline-flex items-center justify-center gap-2 bg-gray-700 text-white border border-gray-500 px-3 py-2 rounded-lg text-sm font-medium mt-auto w-max self-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {phase.badge}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== BLOC 2 : TÉMOIGNAGES ========== */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
          {/* En-tête */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
              {t.testimonials.label}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              {t.testimonials.title}<span className="text-[#F9A825]">{t.testimonials.titleHighlight}</span>{t.testimonials.titleSuffix ? ` ${t.testimonials.titleSuffix}` : ''}
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>

          {/* Grille de témoignages (3 colonnes) - design identique à la maquette */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8 relative overflow-hidden border-l-4 border-[#F9A825]"
              >
                {/* Guillemets orange en haut à gauche - grands et visibles */}
                <div className="text-[#F9A825] text-6xl md:text-7xl font-bold leading-none select-none" aria-hidden>
                  &quot;
                </div>

                {/* Citation en italique, alignée à gauche */}
                <p className="text-gray-900 text-sm md:text-base leading-relaxed mb-6 mt-2 italic font-medium">
                  {testimonial.quote}
                </p>

                {/* Ligne horizontale de séparation */}
                <div className="h-px bg-gray-200 mb-6" aria-hidden />

                {/* Bloc auteur : logo à gauche, infos + étoiles à droite */}
                <div className="flex items-start gap-4">
                  {/* Logo circulaire ou image */}
                  {(testimonial as { useLogoImage?: boolean; isFranchise?: boolean }).useLogoImage || (testimonial as { useLogoImage?: boolean; isFranchise?: boolean }).isFranchise ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0 ring-2 ring-gray-200">
                      <Image
                        src={testimonial.logo}
                        alt={testimonial.company}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain p-1"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#F9A825] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(testimonial as { logoText?: string }).logoText}
                    </div>
                  )}
                  <div className="min-w-0">
                    {(testimonial as { author?: string }).author && (
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      {testimonial.author}
                    </p>
                    )}
                    <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                      {testimonial.company}
                    </p>
                    {/* 5 étoiles orange sous le nom de l'entreprise */}
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-[#F9A825]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation avec flèches */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
              aria-label={t.roadmap.prevTestimonial}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
              aria-label={t.roadmap.nextTestimonial}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
