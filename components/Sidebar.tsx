import React from 'react';
import { 
  Maximize, Crop, RotateCw, MoveHorizontal, 
  Image as ImageIcon, FileOutput, ArrowRightLeft, 
  Minimize2, Wand2, Info, Shield, FileText 
} from 'lucide-react';
import { ToolType, View } from '../types';
import { useLanguage } from '../translations';

interface Props {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Sidebar: React.FC<Props> = ({ activeTool, onSelectTool, currentView, onNavigate }) => {
  const { t } = useLanguage();

  const TOOLS = [
    { id: 'image_resizer', icon: Maximize, label: 'tool.image_resizer' },
    { id: 'crop_image', icon: Crop, label: 'tool.crop_image' },
    { id: 'rotate_image', icon: RotateCw, label: 'tool.rotate_image' },
    { id: 'flip_image', icon: MoveHorizontal, label: 'tool.flip_image' },
    { id: 'image_enlarger', icon: Wand2, label: 'tool.image_enlarger' },
    { id: 'image_compressor', icon: Minimize2, label: 'tool.image_compressor' },
    { id: 'image_converter', icon: FileOutput, label: 'tool.image_converter' },
  ];

  const CONVERTERS = [
    { id: 'jpg_to_png', label: 'tool.jpg_to_png' },
    { id: 'png_to_jpg', label: 'tool.png_to_jpg' },
    { id: 'webp_to_jpg', label: 'tool.webp_to_jpg' },
  ];

  const INFO = [
    { id: 'about', icon: Info, label: 'menu.about', view: 'about' as View },
    { id: 'privacy', icon: Shield, label: 'menu.privacy', view: 'privacy' as View },
    { id: 'terms', icon: FileText, label: 'menu.terms', view: 'terms' as View },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 md:min-h-[calc(100vh-64px)] overflow-y-auto relative">
      <div className="p-4 space-y-6">
        
        {/* TOOLS SECTION */}
        <div className="relative">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 z-10 relative">
            {t('nav.tools')}
          </h3>
          <div className="space-y-1 relative z-10">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentView === 'tool' && activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as ToolType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  {t(tool.label)}
                </button>
              );
            })}
          </div>

          {/* Top Visual: Resize Animation */}
          <div className="absolute right-0 top-8 w-20 h-full pointer-events-none opacity-20 overflow-hidden hidden md:block">
             <svg viewBox="0 0 100 200" className="w-full h-full">
                <defs>
                   <linearGradient id="grad-resize" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                   </linearGradient>
                </defs>
                <g className="animate-[pulse_3s_infinite]">
                   <rect x="40" y="20" width="40" height="30" rx="4" stroke="#3B82F6" strokeWidth="2" fill="none" />
                   <path d="M60 60 V80" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 2" />
                   <path d="M55 75 L60 80 L65 75" stroke="#3B82F6" strokeWidth="1" fill="none" />
                   <rect x="50" y="90" width="20" height="15" rx="2" fill="url(#grad-resize)" stroke="#3B82F6" strokeWidth="1" />
                </g>
             </svg>
          </div>
        </div>

        {/* CONVERTERS SECTION */}
        <div className="relative">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 z-10 relative">
            {t('nav.convert')}
          </h3>
          <div className="space-y-1 relative z-10">
            {CONVERTERS.map((tool) => {
              const isActive = currentView === 'tool' && activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as ToolType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-1'
                  }`}
                >
                  <ArrowRightLeft className={`w-4 h-4 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                  {t(tool.label)}
                </button>
              );
            })}
          </div>

          {/* Middle Visual: Convert Animation */}
          <div className="absolute right-1 top-6 w-16 h-24 pointer-events-none opacity-20 hidden md:block">
             <svg viewBox="0 0 80 100" className="w-full h-full">
                <g className="animate-[bounce_4s_infinite]">
                   <rect x="10" y="10" width="25" height="25" rx="4" fill="#8B5CF6" fillOpacity="0.2" />
                   <text x="22" y="27" fontSize="10" textAnchor="middle" fill="#8B5CF6">JPG</text>
                   
                   <path d="M45 22 H55 M50 17 L55 22 L50 27" stroke="#8B5CF6" strokeWidth="2" />
                   <path d="M35 52 H25 M30 47 L25 52 L30 57" stroke="#8B5CF6" strokeWidth="2" />

                   <rect x="45" y="40" width="25" height="25" rx="4" fill="#8B5CF6" fillOpacity="0.2" />
                   <text x="57" y="57" fontSize="10" textAnchor="middle" fill="#8B5CF6">PNG</text>
                </g>
             </svg>
          </div>
        </div>

        {/* COMPRESS / INFO SECTION */}
        <div className="relative">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {t('nav.info')}
          </h3>
          <div className="space-y-1 relative z-10">
            {INFO.map((item) => {
               const Icon = item.icon;
               const isActive = currentView === item.view;
               return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:translate-x-1'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`} />
                  {t(item.label)}
                </button>
               );
            })}
          </div>
          
          {/* Bottom Visual: Compress Animation (Stacked below convert, near info) */}
          <div className="absolute right-2 top-0 w-12 h-full pointer-events-none opacity-20 hidden md:block">
              <svg viewBox="0 0 60 120" className="w-full h-full">
                  <g className="animate-[pulse_2s_infinite]">
                     <path d="M30 20 L45 35 H35 V55 H25 V35 H15 L30 20 Z" fill="#10B981" fillOpacity="0.3" transform="translate(0, 10)" />
                     <path d="M15 65 H45 V75 H15 V65" fill="#10B981" fillOpacity="0.5" />
                     <path d="M15 80 H45 V85 H15 V80" fill="#10B981" fillOpacity="0.3" />
                     <path d="M30 65 V55" stroke="#10B981" strokeWidth="2" strokeDasharray="2 2" />
                  </g>
              </svg>
          </div>
        </div>

      </div>
    </aside>
  );
};