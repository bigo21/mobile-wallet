'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ComparisonSection() {
  const { t } = useLanguage();
  const userComparison = t.comparison.userRows.map((r) => ({ ourSystem: r.our, classicSystem: r.classic, classicStatus: r.status }));
  const franchiseeComparison = t.comparison.franchiseeRows.map((r) => ({ ourSystem: r.our, classicSystem: r.classic, classicStatus: r.status }));
  const institutionComparison = t.comparison.institutionRows.map((r) => ({ ourSystem: r.our, classicSystem: r.classic, classicStatus: r.status }));
  const synthesisTags = t.comparison.synthesisTags;

  // Fonction pour afficher l'icône selon le statut (colonne système classique)
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'cross':
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'similar':
        return (
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-700 font-bold text-lg leading-none">~</span>
        );
      case 'unavailable':
        return (
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-700 font-bold text-xl leading-none">—</span>
        );
      default:
        return null;
    }
  };

  // Composant pour un bloc de comparaison
  const ComparisonBlock = ({ 
    title, 
    data, 
    className = '' 
  }: { 
    title: string; 
    data: Array<{ ourSystem: string; classicSystem: string; classicStatus: string }>; 
    className?: string;
  }) => (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-0 ${className}`}>
      {/* En-tête du bloc */}
      <div className="border-l-4 border-[#F9A825] bg-gray-50 px-4 py-3">
        <h3 className="text-lg md:text-xl font-bold text-black">{title}</h3>
      </div>
      
      {/* En-têtes des colonnes */}
      <div className="grid grid-cols-2 border-b border-gray-200">
        <div className="bg-black p-3 md:p-4 flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0 text-[#F9A825]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <p className="text-white font-bold text-sm md:text-base uppercase tracking-wide">{t.comparison.withOurSystem}</p>
        </div>
        <div className="bg-gray-100 p-3 md:p-4 border-l border-gray-200">
          <p className="text-gray-800 font-bold text-sm md:text-base uppercase tracking-wide opacity-70">{t.comparison.withClassic}</p>
        </div>
      </div>
      
      {/* Tableau de comparaison */}
      <div className="divide-y divide-gray-200">
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-2 min-h-[56px]">
            {/* Colonne "Avec notre système" : fond blanc, texte vert, checkmark vert dans cercle */}
            <div className="bg-white p-3 md:p-4 border-r border-gray-200 flex items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-black font-bold text-sm md:text-base leading-relaxed flex-1 min-w-0 break-words">{item.ourSystem}</p>
              </div>
            </div>
            
            {/* Colonne "Avec le système classique" : fond gris clair, texte noir/gris, icône selon statut */}
            <div className="bg-gray-50 p-3 md:p-4 flex items-center">
              <div className="flex items-center gap-3 w-full">
                {renderStatusIcon(item.classicStatus)}
                <p className="text-gray-800 text-sm md:text-base leading-relaxed flex-1 min-w-0 break-words">{item.classicSystem}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white pt-8 md:pt-10 pb-16 md:pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
        {/* En-tête */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
            {t.comparison.label}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">
            {t.comparison.title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            {t.comparison.subtitle}
          </p>
        </div>

        {/* Grille de comparaison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* Bloc A : Pour les Utilisateurs (Haut Gauche) */}
          <ComparisonBlock 
            title={t.comparison.forUsers} 
            data={userComparison}
          />

          {/* Bloc B : Pour les Franchisés (Haut Droite) */}
          <ComparisonBlock 
            title={t.comparison.forFranchisees} 
            data={franchiseeComparison}
          />
        </div>

        {/* Bloc C et Bloc de Synthèse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Bloc C : Pour les Institutions Financières (Bas Gauche) */}
          <ComparisonBlock 
            title={t.comparison.forInstitutions} 
            data={institutionComparison}
          />

          {/* Bloc de Synthèse & Citation (Bas Droite) */}
          <div className="bg-[#0D1B2A] rounded-lg shadow-xl p-6 md:p-10 relative overflow-hidden">
            {/* Guillemet orange en haut à gauche */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-0">
              <Image
                src="/images/guillemet-orange.png"
                alt=""
                width={48}
                height={96}
                className="w-8 h-16 md:w-10 md:h-20 object-contain opacity-90"
              />
            </div>

            {/* Contenu */}
            <div className="relative z-10">
              <p className="text-white text-base md:text-lg leading-relaxed mb-10 md:mb-12 pl-10 md:pl-14 italic">
                {t.comparison.synthesisQuote}
              </p>

              {/* 3 tags en pilule : bordure orange, texte blanc */}
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                {synthesisTags.map((label, index) => (
                  <span
                    key={index}
                    className="px-4 md:px-5 py-2 md:py-2.5 bg-transparent border-2 border-[#F9A825] text-white rounded-full text-xs md:text-sm font-normal"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
