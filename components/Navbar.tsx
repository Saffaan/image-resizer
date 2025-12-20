import React from 'react';
import { Menu, Moon, Sun, Globe } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_MENU } from '../constants';
import { useLanguage } from '../translations';

interface Props {
  onOpenLang: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  onNavigate: (view: 'home' | 'tool', toolId?: string) => void;
  onToggleMenu: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenLang, onToggleTheme, theme, onNavigate, onToggleMenu }) => {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <Logo className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {t('brand.name')}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_MENU.map((item, idx) => (
            <div key={idx} className="relative group">
              <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">
                {t(item.labelKey)}
              </button>
              {item.items && (
                <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    {item.items.map((subItem, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => onNavigate('tool', subItem.toolId)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {t(subItem.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenLang}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onToggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={onToggleMenu}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};