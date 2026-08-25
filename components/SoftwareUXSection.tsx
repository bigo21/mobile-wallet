'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

const FeatureIcon1 = () => (
  <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);
const FeatureIcon2 = () => (
  <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const FeatureIcon3 = () => (
  <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);
const FeatureIcon4 = () => (
  <svg className="w-7 h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const DashIcon1 = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);
const DashIcon2 = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const DashIcon3 = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function SoftwareUXSection() {
  const { t } = useLanguage();
  const softwareFeatures = [
    { icon: <FeatureIcon1 key="f1" />, title: t.software.features[0] },
    { icon: <FeatureIcon2 key="f2" />, title: t.software.features[1] },
    { icon: <FeatureIcon3 key="f3" />, title: t.software.features[2] },
    { icon: <FeatureIcon4 key="f4" />, title: t.software.features[3] },
  ];
  const dashIcons = [<DashIcon1 key="d1" />, <DashIcon2 key="d2" />, <DashIcon3 key="d3" />];
  const dashboardFeatures = t.software.dashboardFeatures.map((f, i) => ({
    icon: dashIcons[i],
    title: f.title,
    description: f.desc,
  }));
  const certifications = t.software.certs.map((c, i) => ({
    icon: i === 1 ? 'hourglass' : 'check',
    title: c.title,
    status: c.status,
    color: i === 1 ? 'text-gray-500' : 'text-[#F9A825]',
  }));

  return (
    <section className="w-full bg-white pt-8 md:pt-10 pb-16 md:pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
        {/* Section NOTRE LOGICIEL en haut */}
        <div className="bg-white pt-4 md:pt-6 pb-8 md:pb-12 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* En-tête */}
            <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
              {t.software.label}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight">
              {t.software.title}
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              {t.software.subtitle}
            </p>

            {/* Badges de fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {softwareFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white border-l-4 border-[#F9A825] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#FFF8ED] text-[#E65100]">
                  {feature.icon}
                </div>
                <p className="text-sm md:text-base font-bold text-gray-900 leading-tight">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Grille avec VUE DASHBOARD à gauche et VUE GAB à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 items-stretch">
          {/* ========== BLOC DE GAUCHE : VUE DASHBOARD ========== */}
          <div className="bg-[#0D1B2A] p-5 md:p-6 relative overflow-hidden">
              <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4 text-center">
                {t.software.dashboardLabel}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                {t.software.dashboardTitle}
              </h3>
              <p className="text-gray-300 text-sm md:text-base mb-8">
                {t.software.dashboardSubtitle}
              </p>

              <div className="w-full max-h-[200px] md:max-h-[240px] mb-6 flex items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/images/vue-dashboard.png"
                  alt={t.software.altDashboard}
                  width={480}
                  height={240}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Fonctionnalités Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                  >
                    <div className="text-[#F9A825] mb-2">{feature.icon}</div>
                    <p className="text-black font-semibold text-sm mb-1">{feature.title}</p>
                    <p className="text-gray-800 text-xs">{feature.description}</p>
                  </div>
                ))}
              </div>
          </div>

          {/* ========== BLOC DE DROITE : VUE GAB ========== */}
          <div className="bg-gray-50 p-5 md:p-6 relative">
            {/* En-tête */}
            <p className="text-[#F9A825] text-sm md:text-base font-semibold uppercase tracking-wider mb-4 text-center">
              {t.software.gabLabel}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight text-center">
              {t.software.gabTitle}
            </h2>
            <p className="text-black text-base md:text-lg mb-8 leading-relaxed">
              {t.software.gabSubtitle}
            </p>

            <div className="w-full max-h-[200px] md:max-h-[240px] mb-6 flex items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/images/vue-gab.png"
                alt={t.software.altGAB}
                width={480}
                height={240}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8 min-h-[160px]">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 min-h-[160px] items-stretch">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className={`p-4 flex flex-col items-center text-center justify-center min-h-[130px] md:min-h-[160px] ${index < 2 ? 'md:border-r border-gray-200' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      cert.icon === 'check' ? 'bg-[#F9A825] text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {cert.icon === 'check' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-black font-semibold text-sm mb-0.5">{cert.title}</p>
                    <p className={`text-xs font-medium ${cert.color}`}>{cert.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
