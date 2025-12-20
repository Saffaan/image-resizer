import React, { useEffect, useRef, useState } from 'react';
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

    // Debounce processing
    timeout = setTimeout(runProcessing, 500);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [file, originalImage, config]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden min-h-[400px] flex flex-col relative border border-gray-200 dark:border-gray-700">
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
        Preview
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 bg-[url('https://bg-patterns.netlify.app/bg-patterns/subtle-dots.png')] bg-repeat">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-20 flex items-center justify-center backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full max-h-[500px] object-contain shadow-2xl rounded-lg transition-all"
            style={{ 
               // Apply visual rotation for preview if not "baked in" (but we bake it in processImage)
            }}
          />
        ) : (
           <div className="text-gray-400">Loading...</div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm">
        <div className="text-gray-600 dark:text-gray-300">
           <span className="font-semibold">Output:</span> {stats.width} x {stats.height} px
        </div>
        <div className="text-gray-600 dark:text-gray-300">
           <span className="font-semibold">Est. Size:</span> {(stats.size / 1024).toFixed(1)} KB
        </div>
      </div>
    </div>
  );
};