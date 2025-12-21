import React, { useState, useEffect } from 'react';
import { Upload, Download, Sliders, RotateCw, MoveHorizontal, MoveVertical, Crop as CropIcon, X, AlertCircle, RefreshCw, Type, Maximize2, Minimize2 } from 'lucide-react';
import { DEFAULT_CONFIG, SUPPORTED_FORMATS, FILE_SIZE_PRESETS } from '../constants';
import { ImageFormat, ResizeConfig, ResizeUnit, ProcessedImage, HistoryItem, View, ToolType } from '../types';
import { readFileAsDataURL, loadImage } from './imageUtils';
import { useLanguage } from '../translations';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LanguageModal } from '../components/LanguageModal';
import { HistoryPanel } from '../components/HistoryPanel';
import { LivePreview } from '../components/LivePreview';
import { Sidebar } from '../components/Sidebar';
import { FeatureSection } from '../components/FeatureSection';
import { AboutPage, PrivacyPage, TermsPage } from '../pages/StaticPages';
import { HowToGuide } from '../components/HowToGuide';

export function App() {
  const { t } = useLanguage();
  
  const [view, setView] = useState<View>('home');
  const [activeTool, setActiveTool] = useState<ToolType>('image_resizer');
  
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [config, setConfig] = useState<ResizeConfig>(DEFAULT_CONFIG);
  const [processedResult, setProcessedResult] = useState<ProcessedImage | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, activeTool]);

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    setView('tool');
    
    setConfig(prev => {
       const next = { ...prev };
       if (tool === 'jpg_to_png') next.format = ImageFormat.PNG;
       if (tool === 'png_to_jpg') next.format = ImageFormat.JPG;
       if (tool === 'webp_to_jpg') next.format = ImageFormat.JPG;
       if (tool === 'image_compressor') next.quality = 70;
       return next;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setError(null);
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
      if (key === 'quality') next.targetFileSize = null;
      if (prev.maintainAspectRatio && originalImage && (key === 'width' || key === 'height') && prev.unit === ResizeUnit.PIXELS) {
         const ratio = (prev.crop ? prev.crop.width / prev.crop.height : originalImage.width / originalImage.height);
         if (key === 'width') next.height = Math.round(value / ratio);
         else next.width = Math.round(value * ratio);
      }
      return next;
    });
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

  const resetEdits = () => {
    if (!originalImage) return;
    setConfig({
      ...DEFAULT_CONFIG,
      width: originalImage.width,
      height: originalImage.height,
      format: config.format,
      crop: { x: 0, y: 0, width: originalImage.width, height: originalImage.height }
    });
  };

  const resetApp = () => {
     setFile(null);
     setOriginalImage(null);
     setProcessedResult(null);
     setView('home');
     setConfig(DEFAULT_CONFIG);
  };

  const ResizeSection = () => (
    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
      <h4 className="text-sm font-bold flex items-center gap-2 text-gray-700">
        <Maximize2 className="w-4 h-4" /> Resize Settings
      </h4>
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t('editor.width')}</label>
            <input type="number" value={config.width} onChange={(e) => handleConfigChange('width', Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t('editor.height')}</label>
            <input type="number" value={config.height} onChange={(e) => handleConfigChange('height', Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input type="checkbox" checked={config.maintainAspectRatio} onChange={(e) => handleConfigChange('maintainAspectRatio', e.target.checked)} className="rounded text-blue-600" />
          {t('editor.lock_aspect')}
      </label>
    </div>
  );

  const CropSection = () => {
    if (!originalImage || !config.crop) return null;
    return (
      <div className="p-4 bg-gray-50 rounded-xl space-y-4">
         <h4 className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <CropIcon className="w-4 h-4" /> Crop Selection
         </h4>
         <div className="grid grid-cols-2 gap-3">
            <div>
               <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">X Offset</label>
               <input type="number" value={config.crop.x} onChange={e => setConfig({...config, crop: {...config.crop!, x: Number(e.target.value)}})} className="w-full bg-white border rounded-lg px-2 py-1 text-xs outline-none" />
            </div>
            <div>
               <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Y Offset</label>
               <input type="number" value={config.crop.y} onChange={e => setConfig({...config, crop: {...config.crop!, y: Number(e.target.value)}})} className="w-full bg-white border rounded-lg px-2 py-1 text-xs outline-none" />
            </div>
            <div>
               <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Crop Width</label>
               <input type="number" value={config.crop.width} onChange={e => setConfig({...config, crop: {...config.crop!, width: Number(e.target.value)}})} className="w-full bg-white border rounded-lg px-2 py-1 text-xs outline-none" />
            </div>
            <div>
               <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Crop Height</label>
               <input type="number" value={config.crop.height} onChange={e => setConfig({...config, crop: {...config.crop!, height: Number(e.target.value)}})} className="w-full bg-white border rounded-lg px-2 py-1 text-xs outline-none" />
            </div>
         </div>
         <div className="flex gap-2">
            <button onClick={() => setConfig({...config, crop: { x: 0, y: 0, width: originalImage.width, height: originalImage.height }})} className="flex-1 py-1.5 bg-white border text-xs rounded hover:bg-gray-100 transition-colors">Reset</button>
            <button onClick={() => { const min = Math.min(originalImage.width, originalImage.height); setConfig({...config, crop: { x: (originalImage.width - min)/2, y: (originalImage.height - min)/2, width: min, height: min }}); }} className="flex-1 py-1.5 bg-white border text-xs rounded hover:bg-gray-100 transition-colors">Square</button>
         </div>
      </div>
    );
  };

  const TransformSection = () => (
    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
      <h4 className="text-sm font-bold flex items-center gap-2 text-gray-700">
        <RefreshCw className="w-4 h-4" /> Rotate & Mirror
      </h4>
      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => handleConfigChange('rotation', (config.rotation + 90) % 360)} className="flex flex-col items-center p-2 bg-white border rounded-lg hover:border-blue-500 transition-colors">
            <RotateCw className="w-4 h-4 mb-1 text-blue-500" />
            <span className="text-[10px] font-bold uppercase">Rotate</span>
        </button>
        <button onClick={() => setConfig({...config, flip: {...config.flip, horizontal: !config.flip.horizontal}})} className={`flex flex-col items-center p-2 border rounded-lg transition-colors ${config.flip.horizontal ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white'}`}>
            <MoveHorizontal className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold uppercase">Mirror H</span>
        </button>
        <button onClick={() => setConfig({...config, flip: {...config.flip, vertical: !config.flip.vertical}})} className={`flex flex-col items-center p-2 border rounded-lg transition-colors ${config.flip.vertical ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white'}`}>
            <MoveVertical className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-bold uppercase">Mirror V</span>
        </button>
      </div>
    </div>
  );

  const ExportSection = () => (
    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
        <h4 className="text-sm font-bold flex items-center gap-2 text-gray-700">
           <Type className="w-4 h-4" /> Export Options
        </h4>
        <div className="grid grid-cols-3 gap-1">
            {[ImageFormat.JPG, ImageFormat.PNG, ImageFormat.WEBP].map(fmt => (
              <button key={fmt} onClick={() => handleConfigChange('format', fmt)} className={`py-1.5 text-xs rounded border transition-all ${config.format === fmt ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold' : 'bg-white border-gray-200'}`}>
                  {fmt.split('/')[1].toUpperCase().replace('JPEG', 'JPG')}
              </button>
            ))}
        </div>
        <div>
           <div className="flex justify-between mb-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">{t('editor.quality')}</label>
              <span className="text-[10px] font-bold text-blue-500">{config.quality}%</span>
           </div>
           <input type="range" min="10" max="100" value={config.quality} onChange={(e) => handleConfigChange('quality', Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>
        <div className="pt-2">
           <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">{t('editor.target_size_label')}</label>
           <div className="relative">
              <input type="number" placeholder="Max KB" value={config.targetFileSize || ''} onChange={(e) => handleConfigChange('targetFileSize', e.target.value ? Number(e.target.value) : null)} className="w-full bg-white border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              {config.targetFileSize && <button onClick={() => handleConfigChange('targetFileSize', null)} className="absolute right-2 top-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4"/></button>}
           </div>
        </div>
    </div>
  );

  const renderToolContent = () => {
    if (!file || !originalImage) {
        return (
            <div className="flex-1 flex flex-col items-center py-12 px-4 max-w-5xl mx-auto w-full animate-fade-in-up">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{t(`tool.${activeTool}`)}</h2>
                  <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">Restore, Resize, and Optimize your images instantly with professional precision.</p>
                </div>
                <div className="w-full max-w-xl bg-white p-2 rounded-3xl shadow-2xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all group cursor-pointer" onDragOver={e => e.preventDefault()} onDrop={handleFileSelect}>
                   <label className="cursor-pointer flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed border-transparent group-hover:bg-blue-50 rounded-2xl transition-colors">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Upload className="w-10 h-10 text-blue-600" /></div>
                      <span className="text-2xl font-bold text-gray-900 mb-3">{t('hero.upload_btn')}</span>
                      <span className="text-gray-400">{t('hero.drop_text')}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                   </label>
                </div>
                <HowToGuide />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 w-full animate-fade-in-up px-4">
           <Sidebar activeTool={activeTool} onSelectTool={handleToolChange} currentView={view} onNavigate={setView} />
           <div className="flex-1 flex flex-col gap-6">
              <div className="lg:grid lg:grid-cols-12 gap-8 w-full">
                <div className="lg:col-span-8 space-y-4">
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                         {t(`tool.${activeTool}`)}
                         <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-md">{originalImage.width} x {originalImage.height} Original</span>
                      </h2>
                      <button onClick={resetApp} className="flex items-center gap-2 text-sm text-red-500 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"><X className="w-4 h-4" /> Start Over</button>
                   </div>
                   <LivePreview file={file} originalImage={originalImage} config={config} onResult={setProcessedResult} />
                </div>
                <div className="lg:col-span-4 space-y-6 mt-6 lg:mt-0">
                   <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                      <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2"><Sliders className="w-5 h-5 text-blue-500" /> Toolbox Settings</h3>
                      <ResizeSection />
                      <CropSection />
                      <TransformSection />
                      <ExportSection />
                      <button onClick={downloadImage} disabled={!processedResult} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-lg"><Download className="w-6 h-6" /> Download Optimized</button>
                   </div>
                   {error && <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100"><AlertCircle className="w-5 h-5" /><span className="text-sm font-medium">{error}</span></div>}
                </div>
              </div>
           </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200">
      <Navbar 
         onOpenLang={() => setIsLangModalOpen(true)}
         onNavigate={(v, tId) => {
            if (v === 'tool' && tId) handleToolChange(tId as ToolType);
            else setView(v);
         }}
         onResetImage={resetEdits}
         onClearCanvas={resetApp}
         onDownload={downloadImage}
         canDownload={!!processedResult}
         imageLoaded={!!originalImage}
      />
      
      <main className="py-8 md:py-12">
         {view === 'home' && renderHome()}
         {(view === 'tool' || view === 'about' || view === 'privacy' || view === 'terms') && (
            view === 'about' ? <AboutPage /> : 
            view === 'privacy' ? <PrivacyPage /> : 
            view === 'terms' ? <TermsPage /> : 
            renderToolContent()
         )}
      </main>

      <Footer onOpenLang={() => setIsLangModalOpen(true)} onNavigate={(v, tId) => { if (v === 'tool' && tId) handleToolChange(tId as ToolType); else setView(v); }} />
      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
      {history.length > 0 && view === 'tool' && <HistoryPanel history={history} />}
    </div>
  );

  function renderHome() {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative text-center py-12">
            <h1 className="text-5xl md:text-7xl font-black mb-8 animate-hero-reveal bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600">{t('hero.title')}</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">{t('hero.subtitle')}</p>
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 max-w-2xl mx-auto cursor-pointer hover:scale-[1.02] transition-all group" onClick={() => handleToolChange('image_resizer')}>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 text-blue-600 transition-transform group-hover:rotate-12"><Upload className="w-12 h-12" /></div>
                  <span className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-colors shadow-2xl shadow-blue-600/30 mb-4">Open Tool</span>
                  <span className="text-gray-400 font-medium">Privacy First: All edits happen in your browser.</span>
                </div>
            </div>
        </div>
        <FeatureSection />
      </div>
    );
  }
}