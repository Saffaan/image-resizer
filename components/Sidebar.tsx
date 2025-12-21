import React from 'react';
import { 
  Maximize, Crop, RotateCw, MoveHorizontal, 
  FileOutput, ArrowRightLeft, 
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
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 md:min-h-[calc(100vh-64px)] overflow-y-auto relative hidden lg:block">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {t('nav.tools')}
          </h3>
          <div className="space-y-1">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentView === 'tool' && activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as ToolType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  {t(tool.label)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {t('nav.convert')}
          </h3>
          <div className="space-y-1">
            {CONVERTERS.map((tool) => {
              const isActive = currentView === 'tool' && activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as ToolType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ArrowRightLeft className={`w-4 h-4 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                  {t(tool.label)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            {t('nav.info')}
          </h3>
          <div className="space-y-1">
            {INFO.map((item) => {
               const Icon = item.icon;
               const isActive = currentView === item.view;
               return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                  {t(item.label)}
                </button>
               );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};