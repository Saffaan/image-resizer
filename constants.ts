import { ResizeConfig, ImageFormat, ResizeUnit, Language, NavItem } from './types';

export const DEFAULT_CONFIG: ResizeConfig = {
  width: 0,
  height: 0,
  maintainAspectRatio: true,
  unit: ResizeUnit.PIXELS,
  format: ImageFormat.JPG,
  backgroundColor: '#FFFFFF',
  dpi: 72,
  targetFileSize: 100,
  rotation: 0,
  flip: { horizontal: false, vertical: false },
};

export const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const MAX_FILE_SIZE_MB = 50;

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export const NAV_MENU: NavItem[] = [
  {
    labelKey: 'nav.tools',
    href: 'tool',
    items: [
      { labelKey: 'tool.image_resizer', href: 'tool', toolId: 'image_resizer' },
      { labelKey: 'tool.crop_image', href: 'tool', toolId: 'crop_image' },
      { labelKey: 'tool.rotate_image', href: 'tool', toolId: 'rotate_image' },
      { labelKey: 'tool.flip_image', href: 'tool', toolId: 'flip_image' },
      { labelKey: 'tool.image_enlarger', href: 'tool', toolId: 'image_enlarger' },
    ]
  },
  {
    labelKey: 'nav.convert',
    href: 'tool',
    items: [
      { labelKey: 'tool.image_converter', href: 'tool', toolId: 'image_converter' },
      { labelKey: 'tool.jpg_to_png', href: 'tool', toolId: 'jpg_to_png' },
      { labelKey: 'tool.png_to_jpg', href: 'tool', toolId: 'png_to_jpg' },
    ]
  },
  {
    labelKey: 'nav.compress',
    href: 'tool',
    toolId: 'image_compressor'
  }
];

export const FILE_SIZE_PRESETS = [
  { label: '20 KB', value: 20 },
  { label: '50 KB', value: 50 },
  { label: '100 KB', value: 100 },
  { label: '200 KB', value: 200 },
  { label: '500 KB', value: 500 },
];