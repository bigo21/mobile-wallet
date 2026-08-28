'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function ROISection() {
  const { t } = useLanguage();
  const roiComparison = [
    { title: t.roi.card1, icon: '🏧', roi: t.roi.roi1, roiProgress: 25, revenue: '7.4 M XAF', type: 'mono' },
    { title: t.roi.card2, icon: '⚡', roi: t.roi.roi2, roiProgress: 95, revenue: '22.2 M XAF', type: 'multi', badge: t.roi.badgeRecommended, speedBadge: t.roi.speedBadge },
    { title: t.roi.card3, icon: '🏧', iconCount: 3, roi: t.roi.roi3, roiProgress: 30, revenue: '22.15 M XAF', type: 'mono' },
    { title: t.roi.card4, icon: '⚡', iconCount: 3, roi: t.roi.roi4, roiProgress: 95, revenue: '66.45 M XAF', type: 'multi', badge: t.roi.badgeBestROI, speedBadge: t.roi.speedBadge },
  ];

  const advantages = t.roi.advantages;

  // Composant pour une carte ROI
  const ROICard = ({ data, isMulti = false }: { data: any; isMulti?: boolean }) => {
    const roiParts = (data.roi || '').split(' ');
    const roiValue = roiParts[0] || '';
    const roiUnit = roiParts.slice(1).join(' ') || 'Années';
    const revenueStr = data.revenue || '';
    const revenueMatch = revenueStr.match(/^(.+?)\s+(XAF)$/);
    const revenueValue = revenueMatch ? revenueMatch[1] : revenueStr;
    const revenueCurrency = revenueMatch ? revenueMatch[2] : '';
    const revenueLabel = data.title.includes('Pack') ? t.roi.revenueProj : t.roi.revenueEst;

    return (
      <div
        className={`rounded-xl p-6 md:p-8 relative md:h-full md:flex md:flex-col ${
          isMulti
            ? 'bg-gradient-to-br from-[#F9A825] to-[#F57C00] shadow-[0_0_40px_rgba(249,168,37,0.6)]'
            : 'bg-[#1e293b]'
        }`}
      >
        {/* Badge RECOMMANDÉ / MEILLEUR ROI (cartes multi) */}
        {data.badge && (
          <div className="absolute top-4 right-4 bg-white text-black rounded-full px-4 py-2 flex items-center gap-2 shadow-md z-10">
            {data.badge === t.roi.badgeRecommended ? (
              <svg className="w-4 h-4 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
            <span className="font-bold text-xs text-black">{data.badge}</span>
          </div>
        )}

        {/* En-tête : icône (orange sur cartes grises, noir sur cartes orange) + titre, puis trait horizontal.
            Sur mobile, si un badge est présent, on décale le titre vers le bas pour éviter qu'il passe sous le badge. */}
        <div className={`flex items-center gap-3 pb-4 border-b ${data.badge ? 'pt-10 md:pt-0' : ''} ${isMulti ? 'border-white/30' : 'border-gray-500/50'}`}>
          <span className={`flex items-center gap-0.5 shrink-0 ${isMulti ? 'text-black' : 'text-[#F9A825]'}`} aria-hidden>
            {data.type === 'mono' ? (
              Array.from({ length: data.iconCount || 1 }).map((_, i) => (
                <svg key={i} className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h2M6 12h12M6 16h4" />
                  <circle cx="17" cy="14" r="1.5" />
                </svg>
              ))
            ) : (
              <svg className="w-8 h-8 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </span>
          <h3 className={`text-lg md:text-xl font-bold ${isMulti ? 'text-white' : 'text-gray-100'}`}>
            {data.title}
          </h3>
        </div>

        {/* Contenu principal : 2 colonnes séparées par un trait vertical */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 pt-4 md:pt-5`}>
          {/* Colonne gauche : Retour sur investissement (ROI) */}
          <div className={`pr-0 md:pr-6 md:border-r pb-4 md:pb-0 md:border-b-0 border-b ${isMulti ? 'border-white/30' : 'border-gray-500/50'} mb-0`}>
            <p className={`text-sm mb-2 ${isMulti ? 'text-white/90' : 'text-gray-400'}`}>
              {t.roi.roiLabel}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap mb-2">
              <span className={`text-3xl md:text-4xl font-bold ${isMulti ? 'text-white' : 'text-white'}`}>
                {roiValue}
              </span>
              <span className={`text-base md:text-lg ${isMulti ? 'text-white/80' : 'text-gray-400'}`}>
                {roiUnit}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0 bg-white/20 rounded-full overflow-hidden" style={{ height: '8px' }}>
                <div
                  className={`h-full rounded-full ${
                    isMulti ? 'bg-white' : 'bg-gray-300'
                  } transition-all duration-1000`}
                  style={{ width: `${data.roiProgress}%` }}
                />
              </div>
              <span className={`text-sm font-semibold tabular-nums shrink-0 ${isMulti ? 'text-white/90' : 'text-gray-400'}`}>
                {data.roiProgress}%
              </span>
            </div>
            {data.speedBadge && (
              <div className="inline-flex items-center gap-1 bg-green-800 text-white px-4 py-2 rounded-full border-2 border-green-400 shadow-[0_0_16px_rgba(74,222,128,0.4)] text-xs font-semibold mt-2">
                <span>⚡</span>
                {data.speedBadge}
              </div>
            )}
          </div>

          {/* Colonne droite : Revenu annuel */}
          <div className="md:pl-6">
            <p className={`text-sm mb-2 ${isMulti ? 'text-white/90' : 'text-gray-400'}`}>
              {revenueLabel}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl md:text-3xl" aria-hidden>⭐</span>
              <span className={`text-2xl md:text-3xl font-bold ${isMulti ? 'text-white' : 'text-white'}`}>
                {revenueValue}
              </span>
              {revenueCurrency && (
                <span className={`text-base md:text-lg ${isMulti ? 'text-white/80' : 'text-gray-400'}`}>
                  {revenueCurrency}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full">
      {/* Bloc à fond bleu : limité à l&apos;en-tête, grille ROI et note de réassurance */}
      <div className="w-full bg-[#0A0E1A] py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#3B82F6" strokeWidth="0.5" />
                <circle cx="20" cy="20" r="1" fill="#3B82F6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0 relative z-10">
          {/* En-tête */}
          <div className="text-center mb-12 md:mb-16">
          <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
            {t.roi.label}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t.roi.title}
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
            {t.roi.subtitle}
          </p>
        </div>

        {/* Grille de comparaison ROI : titres + 2x2 cartes, VS au centre */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:items-stretch">
            {/* Ligne des titres : Mono-opérateur | Multi-opérateurs */}
            <h3 className="text-gray-400 font-semibold text-lg md:text-xl md:self-start text-center">Mono-opérateur</h3>
            <h3 className="text-white font-semibold text-lg md:text-xl md:self-start text-center">Multi-opérateurs</h3>
            {/* Ligne 1 : 1 GAB/1 Opérateur | 1 GAB Multi */}
            <ROICard data={roiComparison[0]} isMulti={false} />
            <ROICard data={roiComparison[1]} isMulti={true} />
            {/* Ligne 2 : Pack 3 GAB (01 opérateur) | Pack 3 GAB Multi */}
            <ROICard data={roiComparison[2]} isMulti={false} />
            <ROICard data={roiComparison[3]} isMulti={true} />
          </div>

          {/* Badge VS central (desktop) - entre les 4 cartes, bien centré */}
          <div className="hidden md:flex items-center justify-center absolute inset-0 z-20 pointer-events-none">
            <div className="bg-gray-800 border-2 border-[#F9A825] rounded-xl w-16 h-16 flex items-center justify-center shadow-[0_0_20px_rgba(249,168,37,0.5)]">
              <span className="text-white font-bold text-xl">VS</span>
            </div>
          </div>

          {/* Badge VS pour mobile - centré entre les 4 cartes */}
          <div className="md:hidden flex items-center justify-center my-8">
            <div className="bg-gray-800 border-2 border-[#F9A825] rounded-xl w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(249,168,37,0.5)]">
              <span className="text-white font-bold text-lg">VS</span>
            </div>
          </div>
        </div>

        {/* Note de réassurance */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-800/70 text-white px-4 py-2 rounded-full border-2 border-green-400 shadow-[0_0_16px_rgba(74,222,128,0.4)] text-sm md:text-base font-bold">
            <svg className="w-5 h-5 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t.roi.basedOnData}</span>
          </div>
        </div>
        </div>
      </div>

      {/* Barre de Réassurance Blanche : hors du fond bleu */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0 -mt-6 relative z-10">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center py-6 md:py-0 md:px-6 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0">
                <h4 className={`font-bold text-lg md:text-xl mb-2 ${advantage.title === t.roi.advantages[0].title || advantage.title === t.roi.advantages[2].title ? 'text-black' : 'text-[#F9A825]'}`}>
                  {advantage.title}
                </h4>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {advantage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
