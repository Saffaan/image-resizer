import React from 'react';
import { useLanguage } from '../translations';
import { Lock } from 'lucide-react';

export const AboutPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[80vh] py-20 bg-white animate-fade-in-up">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          {t('about.title')}
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 p-8 rounded-2xl mb-12 border border-blue-100">
            <p className="text-xl text-gray-700 leading-relaxed font-medium">
              {t('about.p1')}
            </p>
          </div>

          <div className="space-y-8 mb-16">
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('about.p2')}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('about.p3')}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Why Trust Us?</h3>
             <ul className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                   <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {t(`about.list${i}`)}
                   </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[80vh] py-20 bg-white animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('privacy.title')}</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <p className="text-lg text-gray-700">{t('privacy.intro')}</p>
          
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 p-1 rounded-full">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-600 leading-relaxed">
                  {t(`privacy.point${i}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const TermsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[80vh] py-20 bg-white animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('terms.title')}</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <p className="text-lg text-gray-700">{t('terms.intro')}</p>
          
          <ul className="list-disc pl-5 space-y-3 text-gray-600">
            <li>{t('terms.point1')}</li>
            <li>{t('terms.point2')}</li>
            <li>{t('terms.point3')}</li>
            <li>{t('terms.point4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ToolPage: React.FC<{ toolName: string; onHome: () => void }> = ({ toolName, onHome }) => {
   return null;
};