'use client';

import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';

// Composants d'icônes SVG
const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 9V13M12 17H12.01M10.29 2.86L1.82 18A2 2 0 003.65 21H20.35A2 2 0 0021.18 18L12.71 2.86A2 2 0 0010.29 2.86Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5"/>
    <path d="M12 6V12L16 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V21H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 16L12 11L16 15L21 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 10H16V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2.5"/>
    <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2.5"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DropletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.69L5 12C5 16.97 8.58 21 12 21C15.42 21 19 16.97 19 12L12 2.69Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function MarketSection() {
  const { t } = useLanguage();
  const statistics = [
    { value: '24,86M', label: t.market.stat1, highlight: false },
    { value: '80%+', label: t.market.stat2, highlight: true },
    { value: '+25%', label: t.market.stat3, highlight: false },
    { value: '500M+', label: t.market.stat4, highlight: false },
  ];

  const icons = [<AlertIcon key="a" />, <ClockIcon key="b" />, <ChartIcon key="c" />, <LockIcon key="d" />, <UsersIcon key="e" />, <DropletIcon key="f" />];
  const limitations = t.market.limits.map((lim, i) => ({
    icon: icons[i],
    title: lim.title,
    description: lim.desc,
  }));

  return (
    <section id="marche" className="w-full bg-white scroll-mt-20">
      {/* Section supérieure - Statistiques */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0 py-16 md:py-20">
        <AnimateOnScroll animation="fade-up">
          {/* Titre principal */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
            <span className="text-black">{t.market.titleBefore}</span>
            <span className="text-[#F9A825]">{t.market.titleAfter}</span>
          </h2>

          {/* Sous-titre */}
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 text-lg leading-relaxed">
            {t.market.subtitle}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={150}>
        {/* Grille de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className={`relative ${
                index < statistics.length - 1
                  ? 'lg:border-r border-gray-300 pr-0 lg:pr-8'
                  : ''
              }`}
            >
              <div
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-3 ${
                  stat.highlight ? 'text-[#F9A825]' : 'text-black'
                }`}
              >
                {stat.value}
              </div>
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fade-up" delay={250}>
        {/* Section "Au Cameroun" */}
        <div className="mt-20 md:mt-24 max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center">
            {/* Titre "Au Cameroun" à gauche - largeur réduite */}
            <div className="flex items-start gap-4 flex-shrink-0 lg:w-auto">
              <div className="w-1 h-12 bg-[#F9A825] rounded-full"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#F9A825] whitespace-nowrap">
                {t.market.cameroon}
              </h3>
            </div>

            {/* Badges de données à droite - sur 2 lignes (2x2) */}
            <div className="grid grid-cols-2 gap-3 flex-1 max-w-4xl">
              {t.market.cameroonData.map((data, index) => (
                <div
                  key={index}
                  className="bg-[#F5F5F5] text-black px-4 py-3 rounded-full text-sm md:text-base font-medium text-center hover:bg-[#F9A825]/20 hover:border hover:border-[#F9A825]/50 transition-colors duration-200"
                >
                  {data}
                </div>
              ))}
            </div>
          </div>
        </div>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll animation="fade-up">
      {/* Section Analyse Critique - Fond sombre */}
      <div className="bg-[#0D1117] rounded-t-3xl md:rounded-t-[40px] pt-4 md:pt-6 pb-6 md:pb-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
          {/* En-tête */}
          <div className="text-center mb-4 md:mb-6">
            <p className="text-[#F9A825] text-xs font-semibold uppercase tracking-wider mb-0.5">
              {t.market.analysisTitle}
            </p>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-0.5">
              {t.market.analysisSubtitle}
            </h2>
            <p className="text-gray-300 text-xs max-w-3xl mx-auto">
              {t.market.analysisDesc}
            </p>
          </div>

          {/* Grille de limitations - 2 colonnes de 3 éléments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-5xl mx-auto">
            {limitations.map((limitation, index) => (
              <div
                key={index}
                className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-2 md:p-3 hover:border-[#F9A825]/50 hover:bg-black/60 hover:scale-[1.02] transition-all duration-300"
              >
                {/* Point orange en haut à droite */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F9A825] rounded-full"></div>

                {/* Icône */}
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-[#F9A825] rounded-lg flex items-center justify-center flex-shrink-0">
                    {limitation.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xs md:text-sm mb-0.5">
                      {limitation.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-tight">
                      {limitation.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </AnimateOnScroll>
    </section>
  );
}
