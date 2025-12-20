import React from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../translations';
import { NAV_MENU } from '../constants';

interface Props {
  onOpenLang: () => void;
  onNavigate: (view: any, toolId?: string) => void;
}

export const Footer: React.FC<Props> = ({ onOpenLang, onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-lg text-gray-900 dark:text-white">{t('brand.name')}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <button 
              onClick={onOpenLang}
              className="mt-4 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Change Language
            </button>
          </div>

          {/* Links Generator */}
          {NAV_MENU.map((section, idx) => (
             <div key={idx}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t(section.labelKey)}</h4>
                <ul className="space-y-2">
                   {section.items ? section.items.map((item, i) => (
                      <li key={i}>
                         <button 
                            onClick={() => onNavigate('tool', item.toolId)}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-left"
                         >
                            {t(item.labelKey)}
                         </button>
                      </li>
                   )) : (
                     <li>
                        <button onClick={() => onNavigate('tool', section.toolId)} className="text-sm text-gray-500 hover:text-blue-600">
                           {t(section.labelKey)}
                        </button>
                     </li>
                   )}
                </ul>
             </div>
          ))}

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 cursor-pointer text-left"
                >
                  {t('footer.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacy')} 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 cursor-pointer text-left"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 cursor-pointer text-left"
                >
                  {t('footer.terms')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};