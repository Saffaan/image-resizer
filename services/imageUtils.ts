
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

        if (config.format === ImageFormat.JPG || config.backgroundColor !== 'transparent') {
            ctx.fillStyle = config.backgroundColor || '#FFFFFF';
            const supportsTransparency = config.format === ImageFormat.PNG || config.format === ImageFormat.WEBP;
            if (!supportsTransparency || config.backgroundColor !== 'transparent') {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        const rotation = (config.rotation % 360 + 360) % 360;
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(config.flip.horizontal ? -1 : 1, config.flip.vertical ? -1 : 1);

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
        const exportQuality = Math.max(0, Math.min(1, quality));
        
        canvas.toBlob((blob) => resolve(blob), exportFormat, exportQuality);
    });
};

export const processImage = async (
  originalImage: HTMLImageElement,
  config: ResizeConfig,
  fileName: string
): Promise<{ blob: Blob; width: number; height: number; url: string }> => {
  
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

  const rotation = (config.rotation % 360 + 360) % 360;
  const isRotatedSides = rotation === 90 || rotation === 270;
  let finalCanvasWidth = isRotatedSides ? targetHeight : targetWidth;
  let finalCanvasHeight = isRotatedSides ? targetWidth : targetHeight;

  let resultBlob: Blob | null = null;
  
  if (config.targetFileSize && config.targetFileSize > 0) {
      const targetBytes = config.targetFileSize * 1024;
      const canAdjustQuality = config.format === ImageFormat.JPG || config.format === ImageFormat.WEBP;
      
      let low = 0.01;
      let high = 1.0;
      let bestBlob: Blob | null = null;

      if (canAdjustQuality) {
        // Increased iterations for ±5% accuracy
        for (let i = 0; i < 12; i++) {
            const mid = (low + high) / 2;
            const blob = await getBlobFromCanvas(originalImage, config, finalCanvasWidth, finalCanvasHeight, mid);
            
            if (blob) {
                if (blob.size <= targetBytes) {
                    bestBlob = blob;
                    low = mid; 
                } else {
                    high = mid;
                }
            }
        }
      }

      if (!bestBlob || (config.format === ImageFormat.PNG)) {
          let scale = 0.95;
          const minScale = 0.05;
          
          while (scale >= minScale) {
             const w = Math.round(finalCanvasWidth * scale);
             const h = Math.round(finalCanvasHeight * scale);
             const q = canAdjustQuality ? 0.75 : 1.0; 
             
             const blob = await getBlobFromCanvas(originalImage, config, w, h, q);
             if (blob && blob.size <= targetBytes) {
                 resultBlob = blob;
                 finalCanvasWidth = w;
                 finalCanvasHeight = h;
                 break;
             }
             scale -= 0.05;
          }
      } else {
          resultBlob = bestBlob;
      }
      
      if (!resultBlob) {
           const w = Math.round(finalCanvasWidth * 0.2);
           const h = Math.round(finalCanvasHeight * 0.2);
           resultBlob = await getBlobFromCanvas(originalImage, config, w, h, 0.4);
           finalCanvasWidth = w;
           finalCanvasHeight = h;
      }

  } else {
      resultBlob = await getBlobFromCanvas(originalImage, config, finalCanvasWidth, finalCanvasHeight, config.quality / 100);
  }

  if (!resultBlob) throw new Error('Image processing failed');
  
  const url = URL.createObjectURL(resultBlob);
  return { blob: resultBlob, width: finalCanvasWidth, height: finalCanvasHeight, url };
};
