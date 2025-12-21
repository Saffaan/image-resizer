import React from 'react';
import { Shield, Zap, CheckCircle, Gift } from 'lucide-react';
import { useLanguage } from '../translations';

export const FeatureSection: React.FC = () => {
  const { t } = useLanguage();

  const FEATURES = [
    { icon: Zap, titleKey: 'feature.fast_title', descKey: 'feature.fast_desc', color: 'bg-yellow-100 text-yellow-600' },
    { icon: Shield, titleKey: 'feature.noupload_title', descKey: 'feature.noupload_desc', color: 'bg-green-100 text-green-600' },
    { icon: CheckCircle, titleKey: 'feature.quality_title', descKey: 'feature.quality_desc', color: 'bg-blue-100 text-blue-600' },
    { icon: Gift, titleKey: 'feature.free_title', descKey: 'feature.free_desc', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {t('feature.heading')}
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('feature.subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, idx) => (
            <div 
              key={idx}
              className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t(f.titleKey)}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t(f.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};