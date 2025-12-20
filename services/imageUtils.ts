import { ResizeConfig, ImageFormat, ResizeUnit } from '../types';

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Helper to get blob from canvas with specific dimensions and quality
const getBlobFromCanvas = (
    originalImage: HTMLImageElement,
    config: ResizeConfig, 
    width: number, 
    height: number,
    quality: number
): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) { resolve(null); return; }

        canvas.width = width;
        canvas.height = height;

        // Draw Background
        if (config.format === ImageFormat.JPG || config.backgroundColor !== 'transparent') {
            ctx.fillStyle = config.backgroundColor || '#FFFFFF';
            const supportsTransparency = config.format === ImageFormat.PNG || config.format === ImageFormat.WEBP;
            if (!supportsTransparency || config.backgroundColor !== 'transparent') {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Setup transforms (rotation, flip)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        const rotation = (config.rotation % 360 + 360) % 360;
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(config.flip.horizontal ? -1 : 1, config.flip.vertical ? -1 : 1);

        // Determine draw dimensions
        let sourceX = 0, sourceY = 0, sourceW = originalImage.width, sourceH = originalImage.height;
        
        if (config.crop) {
            sourceX = config.crop.x;
            sourceY = config.crop.y;
            sourceW = config.crop.width;
            sourceH = config.crop.height;
        }

        const isRotatedSides = rotation === 90 || rotation === 270;
        const drawWidth = isRotatedSides ? height : width;
        const drawHeight = isRotatedSides ? width : height;

        ctx.drawImage(
            originalImage, 
            sourceX, sourceY, sourceW, sourceH,
            -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight
        );
        ctx.restore();

        const exportFormat = config.format === ImageFormat.SVG ? 'image/png' : config.format;
        // Quality must be between 0 and 1
        const exportQuality = Math.max(0, Math.min(1, quality));
        
        canvas.toBlob((blob) => resolve(blob), exportFormat, exportQuality);
    });
};

export const processImage = async (
  originalImage: HTMLImageElement,
  config: ResizeConfig,
  fileName: string
): Promise<{ blob: Blob; width: number; height: number; url: string }> => {
  
  // 1. Calculate Initial Target Dimensions
  let targetWidth = config.width;
  let targetHeight = config.height;
  
  const baseW = config.crop ? config.crop.width : originalImage.width;
  const baseH = config.crop ? config.crop.height : originalImage.height;

  if (config.unit === ResizeUnit.PERCENT) {
    targetWidth = Math.round((baseW * config.width) / 100);
    targetHeight = Math.round((baseH * config.height) / 100);
  } else if (config.unit === ResizeUnit.INCHES) {
    targetWidth = Math.round(config.width * config.dpi);
    targetHeight = Math.round(config.height * config.dpi);
  } else if (config.unit === ResizeUnit.CM) {
    targetWidth = Math.round((config.width * config.dpi) / 2.54);
    targetHeight = Math.round((config.height * config.dpi) / 2.54);
  }

  // Handle Rotation swapping dimensions for the final canvas
  const rotation = (config.rotation % 360 + 360) % 360;
  const isRotatedSides = rotation === 90 || rotation === 270;
  let finalCanvasWidth = isRotatedSides ? targetHeight : targetWidth;
  let finalCanvasHeight = isRotatedSides ? targetWidth : targetHeight;

  // 2. Compression Logic
  let resultBlob: Blob | null = null;
  
  // Use Target File Size logic if set
  if (config.targetFileSize && config.targetFileSize > 0) {
      const targetBytes = config.targetFileSize * 1024; // KB to Bytes
      const canAdjustQuality = config.format === ImageFormat.JPG || config.format === ImageFormat.WEBP;
      
      let low = 0.05;
      let high = 1.0;
      let bestBlob: Blob | null = null;
      let bestDiff = Infinity;

      // ITERATION 1: QUALITY BINARY SEARCH (Fixed Resolution)
      // We try to find the highest quality that fits in the size
      if (canAdjustQuality) {
        for (let i = 0; i < 7; i++) { // 7 steps of binary search is precise enough
            const mid = (low + high) / 2;
            const blob = await getBlobFromCanvas(originalImage, config, finalCanvasWidth, finalCanvasHeight, mid);
            
            if (blob) {
                if (blob.size <= targetBytes) {
                    bestBlob = blob; // This is a candidate
                    low = mid; // Try higher quality
                } else {
                    high = mid; // Too big, lower quality
                }
            }
        }
      }

      // If quality adjustment wasn't enough (or not supported like PNG), we must reduce resolution
      if (!bestBlob && (config.format === ImageFormat.PNG || !canAdjustQuality || (bestBlob === null))) {
          let scale = 0.9;
          const minScale = 0.1;
          
          while (scale >= minScale) {
             const w = Math.round(finalCanvasWidth * scale);
             const h = Math.round(finalCanvasHeight * scale);
             
             // For PNG use default quality (1.0), for others use a low quality baseline (0.5) to ensure size drop
             const q = canAdjustQuality ? 0.7 : 1.0; 
             
             const blob = await getBlobFromCanvas(originalImage, config, w, h, q);
             if (blob && blob.size <= targetBytes) {
                 resultBlob = blob;
                 finalCanvasWidth = w;
                 finalCanvasHeight = h;
                 break;
             }
             scale -= 0.1;
          }
      } else {
          resultBlob = bestBlob;
      }
      
      // Ultimate Fallback: Force fit at drastic reduction if still failed
      if (!resultBlob) {
           const w = Math.round(finalCanvasWidth * 0.3);
           const h = Math.round(finalCanvasHeight * 0.3);
           resultBlob = await getBlobFromCanvas(originalImage, config, w, h, 0.5);
           finalCanvasWidth = w;
           finalCanvasHeight = h;
      }

  } else {
      // Normal processing (Just Quality Slider)
      resultBlob = await getBlobFromCanvas(originalImage, config, finalCanvasWidth, finalCanvasHeight, config.quality / 100);
  }

  if (!resultBlob) throw new Error('Image processing failed');
  
  const url = URL.createObjectURL(resultBlob);
  return { blob: resultBlob, width: finalCanvasWidth, height: finalCanvasHeight, url };
};