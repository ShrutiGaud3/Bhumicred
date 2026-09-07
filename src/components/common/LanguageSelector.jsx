import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'National' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'Northern & Central' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra & Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu' },
];

export const LanguageSelector = ({ className = '' }) => {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  const handleSelect = (code) => {
    setSelectedLang(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-700 shadow-sm"
        title="Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
        <span className="font-semibold">{currentLang.nativeName}</span>
        <span className="text-[10px] text-neutral-400 uppercase">({currentLang.code})</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 py-1.5 z-50 divide-y divide-neutral-100 dark:divide-neutral-800 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Select Platform Language
              </p>
            </div>
            <div className="py-1">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        <span className="text-neutral-400 font-normal">({lang.name})</span>
                      </div>
                      <div className="text-[10px] text-neutral-400 font-normal">{lang.region}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
