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
    targetW: number, 
    targetH: number,
    quality: number
): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }

        // Rotation side swaps
        const rotation = (config.rotation % 360 + 360) % 360;
        const isRotatedSides = rotation === 90 || rotation === 270;
        
        canvas.width = targetW;
        canvas.height = targetH;

        // Background
        if (config.format === ImageFormat.JPG || config.backgroundColor !== 'transparent') {
            ctx.fillStyle = config.backgroundColor || '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Transform sequence: Rotate -> Flip
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(config.flip.horizontal ? -1 : 1, config.flip.vertical ? -1 : 1);

        // Crop coordinates on the original source
        let sX = 0, sY = 0, sW = originalImage.width, sH = originalImage.height;
        if (config.crop) {
            sX = config.crop.x;
            sY = config.crop.y;
            sW = config.crop.width;
            sH = config.crop.height;
        }

        // Draw centered relative to the canvas mid-point
        // Note: drawWidth/Height represent the visual size of the image on the canvas
        // If we rotated 90/270, the "width" of the image occupies the "height" of the canvas and vice versa
        const dw = isRotatedSides ? targetH : targetW;
        const dh = isRotatedSides ? targetW : targetH;

        ctx.drawImage(
            originalImage, 
            sX, sY, sW, sH,
            -dw / 2, -dh / 2, dw, dh
        );
        ctx.restore();

        const exportFormat = config.format === ImageFormat.SVG ? 'image/png' : config.format;
        canvas.toBlob((blob) => resolve(blob), exportFormat, quality);
    });
};

export const processImage = async (
  originalImage: HTMLImageElement,
  config: ResizeConfig,
  fileName: string
): Promise<{ blob: Blob; width: number; height: number; url: string }> => {
  
  let targetWidth = config.width || originalImage.width;
  let targetHeight = config.height || originalImage.height;
  
  const baseW = config.crop ? config.crop.width : originalImage.width;
  const baseH = config.crop ? config.crop.height : originalImage.height;

  if (config.unit === ResizeUnit.PERCENT) {
    targetWidth = Math.round((baseW * config.width) / 100);
    targetHeight = Math.round((baseH * config.height) / 100);
  }

  // Handle canvas swapping dimensions for rotation
  const rotation = (config.rotation % 360 + 360) % 360;
  const isRotatedSides = rotation === 90 || rotation === 270;
  let finalCanvasWidth = isRotatedSides ? targetHeight : targetWidth;
  let finalCanvasHeight = isRotatedSides ? targetWidth : targetHeight;

  let resultBlob: Blob | null = null;
  
  if (config.targetFileSize && config.targetFileSize > 0) {
      const targetBytes = config.targetFileSize * 1024;
      const canAdjustQuality = config.format === ImageFormat.JPG || config.format === ImageFormat.WEBP;
      
      let low = 0.05;
      let high = 1.0;
      let bestBlob: Blob | null = null;

      if (canAdjustQuality) {
        for (let i = 0; i < 10; i++) {
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

      if (!bestBlob) {
          // If quality adjustment isn't enough or possible, scale down
          let scale = 1.0;
          while (scale > 0.1) {
             const w = Math.round(finalCanvasWidth * scale);
             const h = Math.round(finalCanvasHeight * scale);
             const blob = await getBlobFromCanvas(originalImage, config, w, h, 0.7);
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
  } else {
      resultBlob = await getBlobFromCanvas(originalImage, config, finalCanvasWidth, finalCanvasHeight, config.quality / 100);
  }

  if (!resultBlob) throw new Error('Image processing failed');
  
  const url = URL.createObjectURL(resultBlob);
  return { blob: resultBlob, width: finalCanvasWidth, height: finalCanvasHeight, url };
};