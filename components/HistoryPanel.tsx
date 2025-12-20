import React from 'react';
import { Clock, Download } from 'lucide-react';
import { HistoryItem } from '../types';
import { useLanguage } from '../translations';

export const HistoryPanel: React.FC<{ history: HistoryItem[] }> = ({ history }) => {
  const { t } = useLanguage();
  
  if (history.length === 0) return null;

  return (
    <div className="fixed right-0 top-20 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform translate-x-full lg:translate-x-0 border-l border-gray-200 dark:border-gray-700 hidden lg:flex flex-col z-20">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">{t('history.title')}</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 group hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]" title={item.fileName}>
                {item.fileName}
              </div>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {item.details} • {item.size}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
