'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactSecurityFooterSection() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'Cameroun',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation en temps réel
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '' }));
      return true;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: t.contactForm.invalidEmail }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
      return true;
    }
    if (!phoneRegex.test(phone) || phone.length < 8) {
      setErrors((prev) => ({ ...prev, phone: t.contactForm.invalidPhone }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: '' }));
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      validateEmail(value);
    }
    if (name === 'phone') {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email) || !validatePhone(formData.phone)) return;

    setLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/send-contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: selectedCountry.code
            ? `+${selectedCountry.code} ${formData.phone}`
            : formData.phone,
          lang: language,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', country: 'Cameroun', phone: '', message: '' });
        setErrors({ email: '', phone: '' });
      } else {
        setSubmitError(data.error || t.contactForm.errorGeneric);
      }
    } catch {
      setSubmitError(t.contactForm.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  // Pays disponibles avec indicatifs téléphoniques (drapeaux ISO 3166-1 alpha-2)
  const countries = [
    // Afrique centrale & Ouest
    { name: 'Cameroun', code: '237', flag: '🇨🇲' },
    { name: 'Côte d\'Ivoire', code: '225', flag: '🇨🇮' },
    { name: 'RDC', code: '243', flag: '🇨🇩' },
    { name: 'Congo', code: '242', flag: '🇨🇬' },
    { name: 'Gabon', code: '241', flag: '🇬🇦' },
    { name: 'Ghana', code: '233', flag: '🇬🇭' },
    { name: 'Sénégal', code: '221', flag: '🇸🇳' },
    { name: 'Nigeria', code: '234', flag: '🇳🇬' },
    { name: 'Bénin', code: '229', flag: '🇧🇯' },
    { name: 'Togo', code: '228', flag: '🇹🇬' },
    { name: 'Burkina Faso', code: '226', flag: '🇧🇫' },
    { name: 'Mali', code: '223', flag: '🇲🇱' },
    // Afrique de l'Est
    { name: 'Kenya', code: '254', flag: '🇰🇪' },
    { name: 'Tanzanie', code: '255', flag: '🇹🇿' },
    { name: 'Ouganda', code: '256', flag: '🇺🇬' },
    { name: 'Rwanda', code: '250', flag: '🇷🇼' },
    { name: 'Éthiopie', code: '251', flag: '🇪🇹' },
    // Afrique australe
    { name: 'Afrique du Sud', code: '27', flag: '🇿🇦' },
    { name: 'Angola', code: '244', flag: '🇦🇴' },
    { name: 'Mozambique', code: '258', flag: '🇲🇿' },
    { name: 'Zambie', code: '260', flag: '🇿🇲' },
    { name: 'Zimbabwe', code: '263', flag: '🇿🇼' },
    // Afrique du Nord
    { name: 'Maroc', code: '212', flag: '🇲🇦' },
    { name: 'Algérie', code: '213', flag: '🇩🇿' },
    { name: 'Tunisie', code: '216', flag: '🇹🇳' },
    { name: 'Égypte', code: '20', flag: '🇪🇬' },
    // Europe
    { name: 'France', code: '33', flag: '🇫🇷' },
    { name: 'Belgique', code: '32', flag: '🇧🇪' },
    { name: 'Suisse', code: '41', flag: '🇨🇭' },
    { name: 'Royaume-Uni', code: '44', flag: '🇬🇧' },
    { name: 'Allemagne', code: '49', flag: '🇩🇪' },
    { name: 'Espagne', code: '34', flag: '🇪🇸' },
    { name: 'Italie', code: '39', flag: '🇮🇹' },
    { name: 'Portugal', code: '351', flag: '🇵🇹' },
    { name: 'Pays-Bas', code: '31', flag: '🇳🇱' },
    // Amériques
    { name: 'États-Unis', code: '1', flag: '🇺🇸' },
    { name: 'Canada', code: '1', flag: '🇨🇦' },
    { name: 'Brésil', code: '55', flag: '🇧🇷' },
    // Asie & Moyen-Orient
    { name: 'Inde', code: '91', flag: '🇮🇳' },
    { name: 'Chine', code: '86', flag: '🇨🇳' },
    { name: 'Émirats arabes unis', code: '971', flag: '🇦🇪' },
    { name: 'Arabie saoudite', code: '966', flag: '🇸🇦' },
    { name: 'Turquie', code: '90', flag: '🇹🇷' },
    { name: 'Autre', code: '', flag: '🌍' },
  ];

  const selectedCountry = countries.find((c) => c.name === formData.country) ?? countries[0];
  const displayCode = selectedCountry.code ? `+${selectedCountry.code}` : '';

  const securityFeatures = [
    { title: t.security.dataEncrypted, description: t.security.dataEncryptedDesc },
    { title: t.security.secureAccess, description: t.security.secureAccessDesc },
    { title: t.security.traceability, description: t.security.traceabilityDesc },
    { title: t.security.certifications, description: t.security.certificationsDesc },
  ];

  return (
    <>
      {/* ========== BANDEAU ORANGE SUPÉRIEUR ========== */}
      <section className="relative w-full bg-gradient-to-r from-[#F9A825] to-[#F57C00] py-8 md:py-10 overflow-hidden">
        {/* Icône alarme en arrière-plan - bien visible */}
        <div
          className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-10 pointer-events-none"
          aria-hidden
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-white">
            {/* Cadran */}
            <circle cx="32" cy="36" r="22" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Oreilles / cloches alarme */}
            <path d="M18 20 L22 14 L26 20 M38 20 L42 14 L46 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="42" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            {/* Aiguille heures */}
            <line x1="32" y1="36" x2="32" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Aiguille minutes */}
            <line x1="32" y1="36" x2="40" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Pied */}
            <path d="M26 56 L32 52 L38 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {t.cta.title}
              </h3>
              <p className="text-gray-100 text-base md:text-lg max-w-xl">
                {t.cta.subtitle}
              </p>
            </div>
            <Link
              href="#contact"
              className="shrink-0 bg-transparent border-2 border-white text-white font-semibold px-8 py-3.5 rounded-full text-base md:text-lg hover:bg-white/10 transition-colors whitespace-nowrap inline-block text-center"
            >
              {t.cta.btn}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SECTION SÉCURITÉ – Design alternatif ========== */}
      <section className="w-full bg-gray-50 py-16 md:py-20 scroll-mt-20 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
          <div className="relative">
            {/* Fond dégradé sombre avec bordure gauche orange */}
            <div className="relative bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#0D1117] rounded-2xl md:rounded-3xl overflow-hidden border-l-4 md:border-l-[6px] border-[#F9A825] shadow-2xl">
              {/* Motif géométrique discret en arrière-plan */}
              <div className="absolute inset-0 opacity-[0.03]" aria-hidden>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9A825] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F9A825] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10 p-8 md:p-12 lg:p-16">
                {/* En-tête : label + titre centré */}
                <div className="text-center mb-12 md:mb-16">
                  <span className="inline-block px-4 py-1.5 bg-[#F9A825]/20 text-[#F9A825] text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                    {t.security.label}
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto leading-tight">
                    {t.security.title}
                  </h2>
                  <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                    {t.security.subtitle}
                  </p>
                </div>

                {/* Certifications : barre horizontale avec icônes */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 md:mb-16">
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#F9A825]/40 transition-all duration-300">
                    <svg className="w-6 h-6 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-white font-semibold text-sm md:text-base">AES-256</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#F9A825]/40 transition-all duration-300">
                    <svg className="w-6 h-6 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="text-white font-semibold text-sm md:text-base">{t.security.auditsReguliers}</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all duration-300">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-white font-bold text-sm md:text-base">PCI-DSS</span>
                  </div>
                </div>

                {/* Grille : 4 cartes texte centré, sans icônes ni bordures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {securityFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 text-center"
                    >
                      <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Citation de confiance en bas */}
                <div className="mt-12 md:mt-16 pt-8 border-t border-white/10">
                  <p className="text-center text-gray-500 text-sm md:text-base italic max-w-2xl mx-auto">
                    {t.security.quote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION CONTACT ========== */}
      <section id="contact" className="w-full bg-gray-50 py-16 md:py-20 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 min-w-0">
          <div className="w-full">
            {/* Bloc Contact - pleine largeur */}
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Partie Info (Sombre) */}
                <div className="bg-[#0A0E1A] rounded-lg p-6 md:p-8 text-white">
                  <p className="text-[#F9A825] text-xs md:text-sm uppercase tracking-wide mb-4">{t.footer.contactTitle}</p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {t.contactForm.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base mb-8">
                    {t.contactForm.subtitle}
                  </p>

                  {/* Garanties */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm md:text-base">{t.contactForm.response24h}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm md:text-base">{t.contactForm.confidential}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="text-sm md:text-base">{t.contactForm.availableAfrica}</span>
                    </div>
                  </div>
                </div>

                {/* Formulaire */}
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-black mb-2 text-center">
                    {t.contactForm.formTitle}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-6 text-center">
                    {t.contactForm.formSubtitle}
                  </p>

                  {submitSuccess && (
                    <div className="w-full max-w-xl mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                      {t.contactForm.success}
                    </div>
                  )}
                  {submitError && (
                    <div className="w-full max-w-xl mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xl mx-auto min-w-0">
                    {/* Nom Complet */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contactForm.nameLabel}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contactForm.emailLabel}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent outline-none ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      {/* Pays */}
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contactForm.countryLabel}
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent outline-none"
                        >
                          {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                              {country.flag} {country.name}
                              {country.code ? ` (+${country.code})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          {t.contactForm.phoneLabel}
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 min-w-[100px]">
                            <span>{selectedCountry.flag}</span>
                            <span className="text-gray-600 font-medium">
                              {displayCode || 'Code pays'}
                            </span>
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder={selectedCountry.code ? '6 12 34 56 78' : 'Indicatif + numéro'}
                            className={`flex-1 px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border rounded-r-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent outline-none ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Message */}
                      <div className="flex flex-col items-center">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 w-full text-center">
                          {t.contactForm.messageLabel}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder={t.contactForm.messagePlaceholder}
                          className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-transparent outline-none resize-none"
                        />
                      </div>

                      {/* Confidentialité */}
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 text-center">
                        <svg className="w-4 h-4 text-[#F9A825] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>{t.contactForm.privacy}</span>
                      </div>

                      {/* Bouton Submit */}
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full max-w-md mx-auto bg-[#F9A825] text-black font-semibold py-4 px-6 rounded-lg text-base md:text-lg hover:bg-[#F57C00] hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {loading ? t.contactForm.sending : t.contactForm.submit}
                        </button>
                      </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="w-full bg-[#070B14] text-white py-12 md:py-16 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Colonne 1 : Branding */}
            <div>
              <div className="mb-4">
                <Image
                  src="/images/logo_mw.png"
                  alt="MobileWallet Incorporated"
                  width={180}
                  height={60}
                  className="h-8 md:h-12 lg:h-16 w-auto"
                />
              </div>
              <p className="text-white/70 text-sm mb-6">
                {t.footer.tagline}
              </p>
              {/* Réseaux sociaux : Facebook et LinkedIn */}
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/MobileWalletPLC/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F9A825] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/mobile-wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F9A825] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Colonne 2 : Navigation */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t.footer.navTitle}</h4>
              <ul className="space-y-2">
                {[
                  { label: t.footer.links.market, href: '#marche' },
                  { label: t.footer.links.solutions, href: '#solutions' },
                  { label: t.footer.links.about, href: '#apropos' },
                  { label: t.footer.links.plans, href: '#formules' },
                  { label: t.footer.links.team, href: '#equipe' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-[#F9A825] transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : Nos Solutions (formules + solutions) */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t.footer.solutionsTitle}</h4>
              <ul className="space-y-2">
                {[
                  { label: t.footer.links.franchise, href: '#formules' },
                  { label: t.footer.links.bringATM, href: '#formules' },
                  { label: t.footer.links.saas, href: '#formules' },
                  { label: t.footer.links.partner, href: '#formules' },
                  { label: t.footer.links.dashboard, href: '#solutions' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-[#F9A825] transition-colors text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 4 : Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">{t.footer.contactTitle}</h4>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
                <svg className="w-5 h-5 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t.footer.location}</span>
              </div>
              <Link
                href="#contact"
                className="inline-block border-2 border-[#F9A825] text-white px-6 py-3 rounded-3xl hover:bg-[#F9A825] transition-colors text-sm font-semibold"
              >
                {t.footer.contactBtn}
              </Link>
            </div>
          </div>

          {/* Barre de Copyright */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-white/70 text-sm text-center">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
