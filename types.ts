export enum ImageFormat {
  JPG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
}

export enum ResizeUnit {
  PIXELS = 'px',
  PERCENT = '%',
  INCHES = 'in',
  CM = 'cm',
}

export interface CropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeConfig {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  unit: ResizeUnit;
  format: ImageFormat;
  quality: number; // 0-100
  backgroundColor: string;
  dpi: number;
  targetFileSize: number | null; // bytes
  rotation: number; // degrees
  flip: { horizontal: boolean; vertical: boolean };
  crop?: CropConfig;
}

export interface ProcessedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  name: string;
  previewUrl: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  details: string;
  size: string;
  thumbnail?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export type View = 'home' | 'about' | 'privacy' | 'terms' | 'tool';

export type ToolType = 
  | 'image_resizer' 
  | 'crop_image' 
  | 'rotate_image' 
  | 'flip_image' 
  | 'image_enlarger' 
  | 'image_compressor' 
  | 'image_converter' 
  | 'jpg_to_png' 
  | 'png_to_jpg' 
  | 'webp_to_jpg'
  | 'pdf_to_jpg'
  | 'heic_to_jpg'
  | 'png_to_svg';

export interface NavItem {
  labelKey: string;
  href: string; // Used for view switching
  toolId?: ToolType;
  items?: NavItem[];
}
