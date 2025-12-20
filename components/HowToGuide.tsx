import React from 'react';
import { useLanguage } from '../translations';

export const HowToGuide: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 bg-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-800">
      {/* Animation Section */}
      <div className="md:w-1/2 bg-gray-800/50 p-8 flex items-center justify-center relative overflow-hidden">
        <style>{`
            @keyframes arrow-flow {
                0% { opacity: 0; transform: translateX(-10px); }
                30% { opacity: 1; transform: translateX(0); }
                70% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(10px); }
            }
            @keyframes card-in {
                0%, 10% { opacity: 0; transform: scale(0.9) translateX(-20px); }
                20%, 80% { opacity: 1; transform: scale(1) translateX(0); }
                90%, 100% { opacity: 0; transform: scale(0.9) translateX(20px); }
            }
            @keyframes card-out {
                0%, 15% { opacity: 0; transform: scale(0.9) translateX(-20px); }
                25%, 85% { opacity: 1; transform: scale(1) translateX(0); }
                95%, 100% { opacity: 0; transform: scale(0.9) translateX(20px); }
            }
            @keyframes dash-spin {
                to { stroke-dashoffset: -20; }
            }
            .anim-arrow { animation: arrow-flow 3s ease-in-out infinite; }
            .anim-card-left { animation: card-in 3s ease-in-out infinite; }
            .anim-card-right { animation: card-out 3s ease-in-out infinite; animation-delay: 0.2s; }
            .anim-dash { animation: dash-spin 1s linear infinite; }
        `}</style>
        
        <svg viewBox="0 0 400 200" className="w-full max-w-sm h-auto drop-shadow-xl">
            {/* Defs */}
            <defs>
                <linearGradient id="blue-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
            </defs>

            {/* Left Card: Original */}
            <g className="anim-card-left">
                <rect x="40" y="50" width="100" height="100" rx="8" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2" />
                <rect x="55" y="65" width="70" height="70" rx="4" fill="white" fillOpacity="0.2" />
                <circle cx="75" cy="85" r="8" fill="white" fillOpacity="0.4" />
                <path d="M55 135 L80 100 L100 120 L110 110 L125 135 Z" fill="white" fillOpacity="0.3" />
                <text x="90" y="170" fill="white" fontSize="10" textAnchor="middle" opacity="0.6">Original</text>
            </g>

            {/* Middle: Arrow */}
            <g className="anim-arrow">
                 <path d="M160 100 H220 M210 90 L220 100 L210 110" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {/* Right Card: Resized */}
            <g className="anim-card-right">
                <rect x="260" y="60" width="80" height="80" rx="8" fill="url(#blue-grad)" />
                {/* Crop marks */}
                <path d="M255 55 V70 M255 55 H270" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M345 55 V70 M345 55 H330" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M255 145 V130 M255 145 H270" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M345 145 V130 M345 145 H330" stroke="white" strokeWidth="2" strokeLinecap="round" />
                
                <text x="300" y="105" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">JPG</text>
                <text x="300" y="165" fill="#3B82F6" fontSize="10" textAnchor="middle" fontWeight="bold">RESIZED</text>
            </g>
        </svg>
      </div>

      {/* Content Section */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white">{t('howto.title')}</h3>
        <ol className="space-y-6">
          <li className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-900/50">1</span>
            <p className="text-gray-300 text-lg leading-relaxed">{t('howto.step1')}</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-900/50">2</span>
            <p className="text-gray-300 text-lg leading-relaxed">{t('howto.step2')}</p>
          </li>
          <li className="flex items-start gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-900/50">3</span>
            <p className="text-gray-300 text-lg leading-relaxed">{t('howto.step3')}</p>
          </li>
        </ol>
      </div>
    </div>
  );
};