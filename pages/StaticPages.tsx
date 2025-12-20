import React from 'react';
import { useLanguage } from '../translations';
import { Shield, Lock, Cpu, Globe } from 'lucide-react';

export const AboutPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[80vh] py-20 bg-white dark:bg-gray-900 animate-fade-in-up">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          {t('about.title')}
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-2xl mb-12 border border-blue-100 dark:border-gray-700">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {t('about.p1')}
            </p>
          </div>

          <div className="space-y-8 mb-16">
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.p2')}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.p3')}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Why Trust Us?</h3>
             <ul className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                   <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
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
    <div className="min-h-[80vh] py-20 bg-white dark:bg-gray-900 animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('privacy.title')}</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">{t('privacy.intro')}</p>
          
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
    <div className="min-h-[80vh] py-20 bg-white dark:bg-gray-900 animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('terms.title')}</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">{t('terms.intro')}</p>
          
          <ul className="list-disc pl-5 space-y-3 text-gray-600 dark:text-gray-400">
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
