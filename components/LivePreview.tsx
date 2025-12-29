import React, { useEffect, useState } from 'react';
import { ResizeConfig, ProcessedImage } from '../types';
import { processImage } from '../services/imageUtils';

interface Props {
  file: File;
  originalImage: HTMLImageElement;
  config: ResizeConfig;
  onResult: (result: ProcessedImage) => void;
}

export const LivePreview: React.FC<Props> = ({ file, originalImage, config, onResult }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({ width: 0, height: 0, size: 0 });

  useEffect(() => {
    let mounted = true;
    let timeout: ReturnType<typeof setTimeout>;

    const runProcessing = async () => {
      if (!file || !originalImage) return;
      setIsProcessing(true);
      
      try {
        const result = await processImage(originalImage, config, file.name);
        
        if (!mounted) return;

        // Revoke old
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setPreviewUrl(result.url);
        setStats({ width: result.width, height: result.height, size: result.blob.size });
        
        const ext = config.format.split('/')[1];
        const namePart = file.name.substring(0, file.name.lastIndexOf('.'));
        
        onResult({
          ...result,
          size: result.blob.size,
          name: `${namePart}_resized.${ext}`,
          previewUrl: result.url
        });
        
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setIsProcessing(false);
      }
    };

    // Debounce processing - shortened to 150ms for snappier "live" feel
    // while still preventing heavy processing on every micro-keystroke (for width/height)
    timeout = setTimeout(runProcessing, 150);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [file, originalImage, config]);

  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden min-h-[400px] h-[500px] flex flex-col relative border border-gray-200 shadow-inner">
      <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md z-10 border border-white/10">
        Live Preview
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-[url('https://bg-patterns.netlify.app/bg-patterns/subtle-dots.png')] bg-repeat overflow-hidden">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/40 z-20 flex items-center justify-center backdrop-blur-[1px] transition-all duration-300">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent shadow-lg"></div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-white/80 px-2 py-0.5 rounded shadow-sm">Optimizing...</span>
            </div>
          </div>
        )}
        
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-transform duration-300 ease-out"
            style={{ 
               // Rotation is baked into the blob by processImage
            }}
          />
        ) : (
           <div className="text-gray-400 font-medium animate-pulse">Initializing Canvas...</div>
        )}
      </div>
      
      <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center text-xs">
        <div className="text-gray-600">
           <span className="font-bold text-gray-400 uppercase mr-1">Output:</span> <span className="text-gray-900 font-mono">{stats.width} × {stats.height}</span> <span className="text-gray-400 font-mono">px</span>
        </div>
        <div className="text-gray-600">
           <span className="font-bold text-gray-400 uppercase mr-1">Estimated Size:</span> <span className="text-blue-600 font-bold font-mono">{(stats.size / 1024).toFixed(1)}</span> <span className="text-gray-400 font-mono">KB</span>
        </div>
      </div>
    </div>
  );
};