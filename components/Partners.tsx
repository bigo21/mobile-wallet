'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Partners() {
  const { t } = useLanguage();
  const partners = [
    { name: 'UBA', bgColor: 'bg-red-600', textColor: 'text-white', logo: '/images/uba.png' },
    { name: 'NCR', bgColor: 'bg-green-600', textColor: 'text-white', logo: '/images/ncr.png' },
    { name: 'KIOSK', bgColor: 'bg-black', textColor: 'text-white', logo: '/images/kiosk-removebg-preview.png' },
    { name: 'Chetu', bgColor: 'bg-teal-600', textColor: 'text-white', logo: '/images/chetu.png' },
    { name: 'NZ Hongzhou', bgColor: 'bg-blue-600', textColor: 'text-white', logo: '/images/hongzhou-removebg-preview.png' },
    { name: 'MTN', bgColor: 'bg-yellow-400', textColor: 'text-black', logo: '/images/mtn.png' },
    { name: 'DIEBOLD NIXDORF', bgColor: 'bg-red-600', textColor: 'text-white', logo: '/images/diebolt-removebg-preview.png' },
    { name: 'HYOSUNG', bgColor: 'bg-blue-600', textColor: 'text-white', logo: '/images/hyosung-removebg-preview.png' },
  ];

  return (
    <section className="bg-white w-full py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
        {/* Titre */}
        <h2 className="text-black text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 tracking-[2px] uppercase">
          {t.partners.title}
        </h2>

        {/* Grille de logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center">
          {partners.map((partner, index) => {
            const isSmallLogo = ['NZ Hongzhou', 'DIEBOLD NIXDORF', 'HYOSUNG'].includes(partner.name);
            return (
              <div
                key={index}
                className={`flex items-center justify-center w-full ${isSmallLogo ? 'h-[60px]' : 'h-[100px]'} hover:scale-110 transition-transform duration-300`}
              >
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={isSmallLogo ? 120 : 200}
                    height={isSmallLogo ? 60 : 100}
                    className={`object-contain ${isSmallLogo ? 'max-h-[60px]' : 'max-h-[100px]'}`}
                    style={{ width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <div className={`${partner.bgColor} ${partner.textColor} px-4 py-2 rounded-lg font-bold text-sm max-h-[40px] flex items-center justify-center`}>
                    {partner.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
