import React, { useState, useRef, useEffect } from 'react';
import { Menu, Globe, Maximize, Crop, RefreshCw, Download, Trash2, X, ChevronRight, Minimize2, FileOutput, ArrowRightLeft } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../translations';
import { ToolType } from '../types';

interface Props {
  onOpenLang: () => void;
  onNavigate: (view: 'home' | 'tool' | 'about' | 'privacy' | 'terms', toolId?: string) => void;
  onResetImage: () => void;
  onClearCanvas: () => void;
  onDownload: () => void;
  canDownload: boolean;
  imageLoaded: boolean;
}

export const Navbar: React.FC<Props> = ({ 
  onOpenLang, 
  onNavigate,
  onResetImage, 
  onClearCanvas,
  onDownload,
  canDownload: _canDownload,
  imageLoaded
}) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  const menuTools = [
    { id: 'image_resizer' as ToolType, icon: Maximize, label: 'tool.image_resizer', color: 'text-blue-500' },
    { id: 'crop_image' as ToolType, icon: Crop, label: 'tool.crop_image', color: 'text-green-500' },
    { id: 'rotate_image' as ToolType, icon: RefreshCw, label: 'tool.rotate_image', color: 'text-orange-500' },
    { id: 'flip_image' as ToolType, icon: ArrowRightLeft, label: 'tool.flip_image', color: 'text-purple-500' },
    { id: 'image_compressor' as ToolType, icon: Minimize2, label: 'tool.image_compressor', color: 'text-red-500' },
    { id: 'image_converter' as ToolType, icon: FileOutput, label: 'tool.image_converter', color: 'text-indigo-500' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('home')}
        >
          <Logo className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-12 transition-transform" />
          <span className="text-lg md:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t('brand.name')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-3">
          <button 
            onClick={onOpenLang}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            title="Language"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Hamburger Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-all ${isMenuOpen ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Full Feature Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 md:w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right">
                <div className="p-3 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Image Tools
                  </div>
                  
                  {menuTools.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAction(() => onNavigate('tool', item.id))}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        {t(item.label)}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}

                  <div className="my-2 border-t border-gray-100"></div>
                  
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Current Image
                  </div>

                  <button 
                    disabled={!imageLoaded}
                    onClick={() => handleAction(onDownload)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Download className="w-5 h-5" />
                    {t('editor.download')}
                  </button>

                  <button 
                    disabled={!imageLoaded}
                    onClick={() => handleAction(onResetImage)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-400" />
                    Reset Edits
                  </button>

                  <button 
                    disabled={!imageLoaded}
                    onClick={() => handleAction(onClearCanvas)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-red-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear Canvas
                  </button>
                </div>
                
                <div className="bg-gray-50 p-3 flex justify-around">
                   <button onClick={() => handleAction(() => onNavigate('about'))} className="text-[10px] font-bold text-gray-400 hover:text-blue-500">About</button>
                   <button onClick={() => handleAction(() => onNavigate('privacy'))} className="text-[10px] font-bold text-gray-400 hover:text-blue-500">Privacy</button>
                   <button onClick={() => handleAction(() => onNavigate('terms'))} className="text-[10px] font-bold text-gray-400 hover:text-blue-500">Terms</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};