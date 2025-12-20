import React from 'react';
import { X } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { useLanguage } from '../translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('modal.select_language')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                onClose();
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                language === lang.code
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className={`font-medium ${language === lang.code ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                  {lang.nativeName}
                </div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
