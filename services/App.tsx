import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, Sliders, RotateCw, MoveHorizontal, FileImage, Crop as CropIcon, X, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_CONFIG, SUPPORTED_FORMATS, FILE_SIZE_PRESETS } from '../constants';
import { ImageFormat, ResizeConfig, ResizeUnit, ProcessedImage, HistoryItem, View, ToolType, CropConfig } from '../types';
import { readFileAsDataURL, loadImage } from './imageUtils';
import { useLanguage } from '../translations';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LanguageModal } from '../components/LanguageModal';
import { HistoryPanel } from '../components/HistoryPanel';
import { LivePreview } from '../components/LivePreview';
import { Sidebar } from '../components/Sidebar';
import { FeatureSection } from '../components/FeatureSection';
import { AboutPage, PrivacyPage, TermsPage, ToolPage } from '../pages/StaticPages';
import { HowToGuide } from '../components/HowToGuide';

const WorkflowIllustration = () => (
    <div className="w-full max-w-lg mx-auto mt-16 mb-8 opacity-90">
        <svg viewBox="0 0 500 120" className="w-full h-auto">
            <defs>
                <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                </filter>
            </defs>
            
            {/* Connecting Path */}
            <path d="M90 60 H410" stroke="url(#flow-grad)" strokeWidth="2" strokeDasharray="6 4" />
            
            {/* Step 1: Image */}
            <g className="animate-[bounce_3s_infinite]">
                <rect x="30" y="30" width="60" height="60" rx="8" fill="white" className="dark:fill-gray-800" stroke="#E5E7EB" strokeWidth="2" filter="url(#shadow)" />
                <rect x="40" y="40" width="40" height="40" rx="4" fill="#E5E7EB" className="dark:fill-gray-700" opacity="0.5" />
                <path d="M40 70 L55 55 L70 70 V80 H40 V70 Z" fill="#9CA3AF" opacity="0.3" />
            </g>

            {/* Arrow 1 */}
            <g className="animate-[pulse_2s_infinite]" transform="translate(130, 50)">
                 <path d="M0 10 H30 M25 5 L30 10 L25 15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 <circle cx="15" cy="10" r="12" fill="#3B82F6" fillOpacity="0.1" />
            </g>

            {/* Step 2: Controls */}
            <g className="animate-[bounce_3s_infinite_0.5s]">
                <rect x="190" y="35" width="50" height="50" rx="12" fill="white" className="dark:fill-gray-800" stroke="#3B82F6" strokeWidth="2" filter="url(#shadow)" />
                <path d="M205 50 H225 M205 60 H225 M205 70 H225" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                <circle cx="210" cy="50" r="2" fill="#3B82F6" />
                <circle cx="220" cy="60" r="2" fill="#3B82F6" />
            </g>

            {/* Arrow 2 */}
             <g className="animate-[pulse_2s_infinite_0.5s]" transform="translate(280, 50)">
                 <path d="M0 10 H30 M25 5 L30 10 L25 15" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 <circle cx="15" cy="10" r="12" fill="#10B981" fillOpacity="0.1" />
            </g>

            {/* Step 3: Optimized */}
            <g className="animate-[bounce_3s_infinite_1s]">
                <rect x="350" y="30" width="60" height="60" rx="8" fill="white" className="dark:fill-gray-800" stroke="#10B981" strokeWidth="2" filter="url(#shadow)" />
                <path d="M370 50 L380 65 L395 45" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <text x="380" y="80" fontSize="8" fill="#10B981" textAnchor="middle" fontWeight="bold">OPTIMIZED</text>
            </g>
        </svg>
    </div>
);

export function App() {
  const { t } = useLanguage();
  
  // App State
  const [view, setView] = useState<View>('home');
  const [activeTool, setActiveTool] = useState<ToolType>('image_resizer');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Image Data
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  
  // Configuration
  const [config, setConfig] = useState<ResizeConfig>(DEFAULT_CONFIG);
  const [processedResult, setProcessedResult] = useState<ProcessedImage | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  // Scroll to top on view or tool change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, activeTool]);

  // Dark Mode
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // Handle Tool Changes
  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    setView('tool');
    setIsMobileMenuOpen(false);
    setAiInsights(null);
    
    // Apply presets based on tool
    setConfig(prev => {
       const next = { ...prev };
       if (tool === 'jpg_to_png') next.format = ImageFormat.PNG;
       if (tool === 'png_to_jpg') next.format = ImageFormat.JPG;
       if (tool === 'webp_to_jpg') next.format = ImageFormat.JPG;
       if (tool === 'image_compressor') {
           next.quality = 70;
       }
       return next;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setError(null);
    setAiInsights(null);
    let selectedFile: File | null = null;

    if ('dataTransfer' in e) selectedFile = e.dataTransfer.files[0];
    else selectedFile = (e.target as HTMLInputElement).files?.[0] || null;

    if (!selectedFile) return;

    if (!SUPPORTED_FORMATS.includes(selectedFile.type) && selectedFile.type !== 'image/svg+xml') {
      setError('Unsupported file format.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(selectedFile);
      const img = await loadImage(dataUrl);
      
      setFile(selectedFile);
      setOriginalImage(img);
      setConfig({
        ...DEFAULT_CONFIG,
        width: img.width,
        height: img.height,
        format: selectedFile.type as ImageFormat || ImageFormat.JPG,
        crop: { x: 0, y: 0, width: img.width, height: img.height }
      });
      setView('tool');
    } catch (err) {
      console.error(err);
      setError('Failed to load image');
    }
  };

  const handleConfigChange = (key: keyof ResizeConfig, value: any) => {
    setConfig(prev => {
      const next = { ...prev, [key]: value };
      
      if (key === 'quality') {
          next.targetFileSize = null; 
      }
      
      if (key === 'targetFileSize' && value !== null) {
          if (value < 0) return prev;
      }

      if (prev.maintainAspectRatio && originalImage && (key === 'width' || key === 'height') && prev.unit === ResizeUnit.PIXELS) {
         const ratio = originalImage.width / originalImage.height;
         if (key === 'width') next.height = Math.round(value / ratio);
         else next.width = Math.round(value * ratio);
      }
      return next;
    });
  };

  const handleAiAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dataUrl = await readFileAsDataURL(file);
      const base64Data = dataUrl.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            { text: "Act as a professional photo editor. Analyze this image and provide 3 short, actionable, bulleted professional tips specifically for resizing or compressing it for optimal web performance. Be extremely concise and focus on visual quality vs file size. Do not use generic advice." }
          ]
        }
      });
      
      setAiInsights(response.text || "No insights available.");
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setError(t('ai.error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateCrop = (newCrop: Partial<CropConfig>) => {
    if (!config.crop) return;
    setConfig(prev => ({ ...prev, crop: { ...prev.crop!, ...newCrop } }));
  };

  const downloadImage = () => {
    if (!processedResult) return;
    const link = document.createElement('a');
    link.href = processedResult.previewUrl;
    link.download = processedResult.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setHistory(prev => [{
       id: Date.now().toString(),
       fileName: processedResult.name,
       date: new Date().toLocaleDateString(),
       details: `${processedResult.width}x${processedResult.height}`,
       size: (processedResult.size / 1024).toFixed(1) + ' KB'
    }, ...prev]);
  };

  const resetApp = () => {
     setFile(null);
     setOriginalImage(null);
     setProcessedResult(null);
     setView('home');
     setConfig(DEFAULT_CONFIG);
     setAiInsights(null);
  };

  // --- SUB-COMPONENTS FOR EDITOR ---

  const ResizeControls = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">{t('editor.width')}</label>
            <input 
                type="number" 
                value={config.width}
                onChange={(e) => handleConfigChange('width', Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">{t('editor.height')}</label>
            <input 
                type="number" 
                value={config.height}
                onChange={(e) => handleConfigChange('height', Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />
          </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
          <input 
              type="checkbox" 
              checked={config.maintainAspectRatio} 
              onChange={(e) => handleConfigChange('maintainAspectRatio', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
          />
          {t('editor.lock_aspect')}
      </label>
    </div>
  );

  const CropControls = () => {
    if (!originalImage || !config.crop) return null;
    return (
      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setConfig({...config, crop: { x: 0, y: 0, width: originalImage.width, height: originalImage.height }})} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white">
              Reset Crop
            </button>
            <button onClick={() => {
               const min = Math.min(originalImage.width, originalImage.height);
               setConfig({...config, crop: { x: (originalImage.width - min)/2, y: (originalImage.height - min)/2, width: min, height: min }})
            }} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white">
              Square (1:1)
            </button>
         </div>
      </div>
    );
  };

  const RotateControls = () => (
    <div className="grid grid-cols-2 gap-4">
      <button 
          onClick={() => handleConfigChange('rotation', (config.rotation + 90) % 360)}
          className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
      >
          <RotateCw className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
          <span className="text-xs text-gray-500">{t('editor.rotate')} 90°</span>
      </button>
      <button 
          onClick={() => setConfig({...config, flip: {...config.flip, horizontal: !config.flip.horizontal}})}
          className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
      >
          <MoveHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
          <span className="text-xs text-gray-500">{t('editor.flip')} H</span>
      </button>
    </div>
  );

  const ExportControls = () => (
    <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-2 block">{t('editor.format')}</label>
          <div className="grid grid-cols-3 gap-2">
              {[ImageFormat.JPG, ImageFormat.PNG, ImageFormat.WEBP].map(fmt => (
                <button
                    key={fmt}
                    onClick={() => handleConfigChange('format', fmt)}
                    className={`py-2 text-xs md:text-sm rounded-lg border transition-all ${config.format === fmt ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                >
                    {fmt.split('/')[1].toUpperCase().replace('JPEG', 'JPG')}
                </button>
              ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl space-y-4">
           <div className={config.targetFileSize ? 'opacity-50 pointer-events-none' : ''}>
             <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-gray-500">{t('editor.quality')}</label>
                <span className="text-xs text-gray-500">{config.quality}%</span>
             </div>
             <input 
                type="range" 
                min="10" 
                max="100" 
                value={config.quality}
                onChange={(e) => handleConfigChange('quality', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
           </div>

           <div className="text-center text-xs text-gray-400 font-medium">- OR -</div>

           <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">{t('editor.target_size_label')}</label>
              <div className="flex flex-wrap gap-2 mb-2">
                 {FILE_SIZE_PRESETS.map(preset => (
                    <button
                       key={preset.value}
                       onClick={() => handleConfigChange('targetFileSize', preset.value)}
                       className={`px-3 py-1 text-xs rounded-full border transition-all ${
                          config.targetFileSize === preset.value 
                             ? 'bg-blue-600 border-blue-600 text-white' 
                             : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500'
                       }`}
                    >
                       {preset.label}
                    </button>
                 ))}
                 <button 
                     onClick={() => handleConfigChange('targetFileSize', null)}
                     className={`px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 ${!config.targetFileSize ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : ''}`}
                 >
                     Off
                 </button>
              </div>
              <div className="relative">
                 <input 
                    type="number"
                    placeholder={t('editor.kb_placeholder')}
                    value={config.targetFileSize || ''}
                    min="10"
                    max="10240"
                    onChange={(e) => {
                       const val = e.target.value === '' ? null : Number(e.target.value);
                       handleConfigChange('targetFileSize', val);
                    }}
                    className={`w-full bg-white dark:bg-gray-800 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white pl-16 ${config.targetFileSize ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'}`}
                 />
                 <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-bold">KB MAX</span>
              </div>
           </div>
        </div>
    </div>
  );

  const AiInsightPanel = () => (
    <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
           <Sparkles className="w-4 h-4" />
           {t('ai.title')}
        </h4>
        <button 
          onClick={handleAiAnalyze}
          disabled={isAnalyzing}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
        >
          {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {isAnalyzing ? t('ai.analyzing') : t('ai.analyze_btn')}
        </button>
      </div>
      
      {aiInsights ? (
        <div className="text-xs text-indigo-900/80 dark:text-indigo-200 leading-relaxed whitespace-pre-wrap">
          {aiInsights}
        </div>
      ) : !isAnalyzing && (
        <p className="text-xs text-gray-400 italic">Click for AI-powered resizing tips for this specific image.</p>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
           <AlertCircle className="w-3 h-3" />
           {error}
        </div>
      )}
    </div>
  );

  // --- VIEW RENDERS ---

  const renderHome = () => (
    <>
      <div className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://bg-patterns.netlify.app/bg-patterns/subtle-dots.png')] opacity-10" />
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
               v2.1 AI Enhanced
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight animate-hero-reveal bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 drop-shadow-sm pb-2">
                {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                {t('hero.subtitle')}
            </p>
            
            <div 
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 max-w-xl mx-auto cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all group animate-bounce-subtle"
                onDragOver={e => e.preventDefault()}
                onDrop={handleFileSelect}
            >
                <input 
                  type="file" 
                  id="upload-hero" 
                  className="hidden" 
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileSelect} 
                />
                <label htmlFor="upload-hero" className="cursor-pointer flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 mb-4">
                      {t('hero.upload_btn')}
                  </span>
                  <span className="text-sm text-gray-400">
                      {t('hero.drop_text')}
                  </span>
                </label>
            </div>
          </div>
          <WorkflowIllustration />
      </div>
      <FeatureSection />
    </>
  );

  const renderToolLayout = (content: React.ReactNode) => {
     return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
           <div className="hidden md:block">
              <Sidebar 
                 activeTool={activeTool} 
                 onSelectTool={handleToolChange} 
                 currentView={view}
                 onNavigate={setView}
              />
           </div>
           <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 md:p-8 overflow-y-auto flex flex-col relative">
              {content}
           </div>
        </div>
     );
  };

  const renderToolContent = () => {
    if (!file || !originalImage) {
        return (
            <div className="flex-1 flex flex-col items-center py-6 animate-fade-in-up max-w-5xl mx-auto w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      {t(`tool.${activeTool}`)}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                      {t('hero.subtitle')}
                  </p>
                </div>
                
                <div 
                    className="w-full max-w-2xl bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group cursor-pointer mb-8"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleFileSelect}
                >
                   <label className="cursor-pointer flex flex-col items-center justify-center px-10 py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {t('hero.upload_btn')}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                          {t('hero.drop_text')}
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                   </label>
                </div>
                <HowToGuide />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 w-full animate-fade-in-up">
           <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="mb-4 flex items-center justify-between">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    {t(`tool.${activeTool}`)}
                    <span className="text-xs font-normal text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                       {config.width}x{config.height}
                    </span>
                 </h2>
                 <button onClick={resetApp} className="text-sm text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors">
                    Close Project
                 </button>
              </div>
              <LivePreview 
                  file={file} 
                  originalImage={originalImage} 
                  config={config} 
                  onResult={setProcessedResult}
              />
           </div>

           <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-500" />
                    {t('editor.settings')}
                 </h3>

                 {(activeTool === 'image_resizer' || activeTool === 'image_enlarger') && <ResizeControls />}
                 {activeTool === 'crop_image' && <CropControls />}
                 {(activeTool === 'rotate_image' || activeTool === 'flip_image') && <RotateControls />}
                 
                 <ExportControls />

                 {/* AI Insights Panel */}
                 <AiInsightPanel />

                 <div className="mt-8 space-y-3">
                   <button 
                      onClick={downloadImage}
                      disabled={!processedResult}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                   >
                      <Download className="w-5 h-5" />
                      {t('editor.download')}
                   </button>
                 </div>
              </div>
           </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500/30">
      <Navbar 
         onOpenLang={() => setIsLangModalOpen(true)}
         onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
         theme={theme}
         onNavigate={(v, tId) => {
            if (v === 'tool' && tId) handleToolChange(tId as ToolType);
            else setView(v);
         }}
         onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <Sidebar 
                        activeTool={activeTool} 
                        onSelectTool={handleToolChange} 
                        currentView={view} 
                        onNavigate={(v) => {
                            setView(v);
                            setIsMobileMenuOpen(false);
                        }}
                    />
                </div>
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
      )}
      
      <main>
         {view === 'home' && renderHome()}
         {view === 'tool' && renderToolLayout(renderToolContent())}
         {view === 'about' && renderToolLayout(<AboutPage />)}
         {view === 'privacy' && renderToolLayout(<PrivacyPage />)}
         {view === 'terms' && renderToolLayout(<TermsPage />)}
      </main>

      <Footer 
         onOpenLang={() => setIsLangModalOpen(true)} 
         onNavigate={(v, tId) => {
            if (v === 'tool' && tId) handleToolChange(tId as ToolType);
            else setView(v);
         }}
      />
      
      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
      {history.length > 0 && view === 'tool' && <HistoryPanel history={history} />}
    </div>
  );
}