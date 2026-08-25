'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';

const ReassuranceIcon1 = () => (
  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);
const ReassuranceIcon2 = () => (
  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const ReassuranceIcon3 = () => (
  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function TeamSection() {
  const { t } = useLanguage();
  const allTeamMembers = [
    { name: 'Yvan Tadie', titleKey: 'ceo' as const, image: '/images/team/yvan-tadie.png' },
    { name: 'Blaise Valery Ndi', titleKey: 'coo' as const, image: '/images/team/blaise-valery-ndi.png' },
    { name: 'Raymond Thinda', titleKey: 'accountant' as const, image: '/images/team/raymond-thinda.png' },
    { name: 'Barrister Milton', titleKey: 'complianceOfficer' as const, image: '/images/team/barrister-milton-profile.png' },
    { name: 'Boris Tardezefe', titleKey: 'techOpsLead' as const, image: '/images/team/boris-tardezefe.png' },
    { name: 'Frank Merlin', titleKey: 'complianceOfficer' as const, image: '/images/team/frank-merlin.png' },
    { name: 'Amit Tiwary', titleKey: 'devDirector' as const, image: '/images/team/Capture_d_écran_2026-03-06_141258-removebg-preview.png' },
    { name: 'Priyanshu Singh', titleKey: 'techDevLead' as const, image: '/images/team/Capture_d_écran_2026-03-06_141729-removebg-preview.png', highlighted: true },
    { name: 'Dogo Kingsley', titleKey: 'networkEngineer' as const, image: '/images/team/Capture_d_écran_2026-03-06_141956-removebg-preview.png' },
    { name: 'Suresh Release', titleKey: 'trainingEngineer' as const, image: '/images/team/Capture_d_écran_2026-03-06_142346-removebg-preview.png' },
  ];

  const reassurance = [
    { icon: <ReassuranceIcon1 key="r1" />, text: t.team.reassurance[0] },
    { icon: <ReassuranceIcon2 key="r2" />, text: t.team.reassurance[1] },
    { icon: <ReassuranceIcon3 key="r3" />, text: t.team.reassurance[2] },
  ];

  // Carte carousel (style Axa Zara - slide scrollable)
  const TeamCarouselCard = ({
    name,
    title,
    image,
    highlighted = false,
  }: {
    name: string;
    title: string;
    image: string;
    highlighted?: boolean;
  }) => (
    <div
      className={`flex-shrink-0 w-[280px] md:w-[350px] rounded-xl overflow-hidden bg-white shadow-lg border ${
        highlighted ? 'border-[#F9A825] border-2 ring-2 ring-[#F9A825]/30' : 'border-gray-200'
      } transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
    >
      <div className="relative w-full h-[280px] md:h-[350px] bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 280px, 350px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <h3 className="font-bold text-white text-lg md:text-xl drop-shadow-lg">{name}</h3>
          <p className="text-[#F9A825] text-xs md:text-sm font-semibold uppercase tracking-wide">
            {title}
          </p>
        </div>
      </div>
    </div>
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const CARD_WIDTH = 358;
  const SCROLL_INTERVAL_MS = 2000;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollNext = () => {
      const { scrollLeft: left, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const nextScroll = left + CARD_WIDTH;
      container.scrollTo({
        left: nextScroll >= maxScroll ? 0 : nextScroll,
        behavior: 'smooth',
      });
    };

    const intervalId = setInterval(scrollNext, SCROLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  const scrollLeft = () => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
  };

  return (
    <section id="equipe" className="w-full bg-white scroll-mt-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0 py-16 md:py-20">
        <AnimateOnScroll animation="fade-up">
        {/* En-tête */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
            {t.team.label}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
            {t.team.title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
            {t.team.subtitle}
          </p>
        </div>
        </AnimateOnScroll>

        {/* Carousel avec flèches de navigation */}
        <div className="relative flex items-center gap-4 md:gap-6 px-2 md:px-6">
          {/* Flèche gauche */}
          <button
            type="button"
            onClick={scrollLeft}
            className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 hover:bg-[#F9A825] text-gray-700 hover:text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
            aria-label={t.team.prev}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Zone scrollable centrée */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto overflow-y-hidden scroll-smooth py-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <div className="flex gap-6 md:gap-8 pb-4 justify-center md:justify-start px-4" style={{ minWidth: 'min-content' }}>
              {allTeamMembers.map((member, index) => (
                <TeamCarouselCard
                  key={`${member.name}-${member.titleKey}-${index}`}
                  name={member.name}
                  title={t.team.titles[member.titleKey]}
                  image={member.image}
                  highlighted={!!(member as { highlighted?: boolean }).highlighted}
                />
              ))}
            </div>
          </div>

          {/* Flèche droite */}
          <button
            type="button"
            onClick={scrollRight}
            className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 hover:bg-[#F9A825] text-gray-700 hover:text-white flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
            aria-label={t.team.next}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Barre de Réassurance Bas de Page */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2 justify-items-center">
            {reassurance.map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-gray-100 px-6 py-4 text-[#F9A825] [&>svg]:shrink-0"
              >
                {item.icon}
                <span className="text-gray-800 font-semibold text-sm md:text-base whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
