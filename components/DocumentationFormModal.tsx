'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/translations';

export default function DocumentationFormModal() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [nomComplet, setNomComplet] = useState('');
  const [email, setEmail] = useState('');
  const [docLang, setDocLang] = useState<Language>(language);
  const [loading, setLoading] = useState(false);
  const [messageEnvoye, setMessageEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setErreur('');
    setMessageEnvoye(false);
    setNomComplet('');
    setEmail('');
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openDocumentationModal', handleOpen);
    return () => window.removeEventListener('openDocumentationModal', handleOpen);
  }, []);

  // Le sélecteur de langue du document part par défaut sur la langue du site.
  useEffect(() => {
    if (isOpen) setDocLang(language);
  }, [isOpen, language]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErreur('');

    try {
      const res = await fetch('/api/send-documentation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom_complet: nomComplet, email, lang: language, doc_lang: docLang }),
      });
      const data = await res.json();

      if (data.success) {
        setMessageEnvoye(true);
      } else {
        setErreur(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setErreur('Une erreur est survenue. Vérifiez votre connexion et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-overlay-fade-in"
        onClick={handleClose}
        aria-hidden
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-modal-slide-up border-2 border-[#F9A825]">
        <button
          type="button"
          onClick={handleClose}
          className="flex items-center gap-2 text-gray-600 hover:text-[#F9A825] transition-colors mb-6"
          aria-label="Retour à la page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">{t.contact.back}</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Image src="/images/logo_mw.png" alt="MobileWallet" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="text-gray-900 font-bold text-xl">MobileWallet</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.docModal.title}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {t.docModal.subtitle}
        </p>

        {messageEnvoye ? (
          <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 mb-6">
            {t.docModal.success}
          </div>
        ) : (
          <>
            {erreur && (
              <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 mb-6 text-sm">
                {erreur}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="doc-modal-nom" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  id="doc-modal-nom"
                  type="text"
                  value={nomComplet}
                  onChange={(e) => setNomComplet(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-[#F9A825] outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="doc-modal-email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  ADRESSE EMAIL
                </label>
                <input
                  id="doc-modal-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@exemple.com"
                  className="w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-400 border-2 border-[#F9A825] rounded-lg focus:ring-2 focus:ring-[#F9A825] focus:border-[#F9A825] outline-none"
                  required
                />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  {t.contact.docLangLabel}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDocLang('fr')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${docLang === 'fr' ? 'bg-[#F9A825] border-[#F9A825] text-black' : 'bg-white border-gray-300 text-gray-700 hover:border-[#F9A825]'}`}
                  >
                    Français
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocLang('en')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${docLang === 'en' ? 'bg-[#F9A825] border-[#F9A825] text-black' : 'bg-white border-gray-300 text-gray-700 hover:border-[#F9A825]'}`}
                  >
                    English
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F9A825] hover:bg-[#F57C00] text-black font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? t.contact.sending : t.docModal.submit}
              </button>
            </form>
          </>
        )}

        <div className="flex items-center gap-2 mt-6 text-gray-500 text-xs">
          <span>🔒</span>
          <span>{t.contact.privacy}</span>
        </div>
      </div>
    </div>
  );
}
