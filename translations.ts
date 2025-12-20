import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LANGUAGES } from './constants';

type Dictionary = Record<string, string>;

const en: Dictionary = {
  'brand.name': 'Image Resizer Tool',
  'nav.tools': 'Image Tools',
  'nav.convert': 'Convert',
  'nav.compress': 'Compress',
  'nav.info': 'Information',
  
  'tool.image_resizer': 'Resize Image',
  'tool.crop_image': 'Crop Image',
  'tool.rotate_image': 'Rotate Image',
  'tool.flip_image': 'Flip Image',
  'tool.image_enlarger': 'Image Enlarger',
  'tool.image_compressor': 'Compress Image',
  'tool.image_converter': 'Convert Image',
  'tool.jpg_to_png': 'JPG to PNG',
  'tool.png_to_jpg': 'PNG to JPG',
  'tool.webp_to_jpg': 'WebP to JPG',
  
  'menu.about': 'About Us',
  'menu.privacy': 'Privacy Policy',
  'menu.terms': 'Terms of Service',
  
  'hero.title': 'The Best Free Image Resizer',
  'hero.subtitle': 'Resize, compress, convert, and edit your images for free with professional quality.',
  'hero.upload_btn': 'Select Images',
  'hero.drop_text': 'or drag and drop images here',
  
  'editor.settings': 'Settings',
  'editor.width': 'Width',
  'editor.height': 'Height',
  'editor.lock_aspect': 'Lock Aspect Ratio',
  'editor.unit': 'Unit',
  'editor.format': 'Format',
  'editor.quality': 'Quality',
  'editor.target_size_label': 'Target File Size (Max)',
  'editor.kb_placeholder': 'Custom KB',
  'editor.bg_color': 'Background Color',
  'editor.dpi': 'DPI',
  'editor.target_size': 'Target Size (KB)',
  'editor.rotate': 'Rotate',
  'editor.flip': 'Flip',
  'editor.download': 'Download Image',
  'editor.processing': 'Processing...',
  'editor.compressing': 'Compressing...',
  'editor.start_over': 'Start Over',
  'editor.auto': 'Auto',
  'editor.crop_mode': 'Crop Mode',
  'editor.manual': 'Manual',
  'editor.square': 'Square (1:1)',
  'editor.16_9': 'Landscape (16:9)',
  'editor.4_3': 'Standard (4:3)',
  
  'ai.analyze_btn': 'AI Smart Insights',
  'ai.analyzing': 'Analyzing with AI...',
  'ai.title': 'AI Recommendations',
  'ai.error': 'Could not get AI insights.',
  
  'howto.title': 'How to Resize an Image?',
  'howto.step1': 'Click on the "Select Images" button to select an image.',
  'howto.step2': 'Enter a new target size or choose a format for your image.',
  'howto.step3': 'Click the "Download Image" button to save the resized image.',

  'footer.about': 'About Us',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.copyright': '© 2026 Image Resizer Tool. All rights reserved.',
  
  'modal.select_language': 'Select Language',
  'history.title': 'Recent Edits',
  'history.empty': 'No recent history',

  'feature.heading': 'Why Use Image Resizer Tool?',
  'feature.subheading': 'Experience the best online image editing features completely free.',
  'feature.fast_title': 'Fast & Secure',
  'feature.fast_desc': 'All processing happens in your browser. Your photos never leave your device.',
  'feature.noupload_title': 'No Upload Required',
  'feature.noupload_desc': 'Powered by modern browser technology for instant results without server uploads.',
  'feature.quality_title': 'High Quality Output',
  'feature.quality_desc': 'Advanced algorithms ensure your images stay sharp even after resizing or compression.',
  'feature.free_title': 'Free Forever',
  'feature.free_desc': 'No hidden costs, no watermarks, and no sign-up required. Just unlimited edits.',

  'about.title': 'About Image Resizer Tool',
  'about.p1': 'Image Resizer Tool helps users resize, compress, and convert images easily without losing quality.',
  'about.p2': 'Our tool works fully in the browser, keeping your images private and secure.',
  'about.p3': 'Trusted by users worldwide for fast, simple, and reliable image processing.',
  'about.list1': '100% browser-based processing',
  'about.list2': 'No image uploads or storage',
  'about.list3': 'Precise KB-based compression',
  'about.list4': 'Free and fast tools',
  'about.list5': 'Works on all modern devices',

  'privacy.title': 'Privacy Policy',
  'privacy.intro': 'Your privacy is our top priority. This policy outlines how we handle your data.',
  'privacy.point1': 'No Server Uploads: Images are processed locally in your browser memory.',
  'privacy.point2': 'No Data Storage: We do not store, save, or view your images.',
  'privacy.point3': 'No Tracking: We do not track your file names or metadata.',
  'privacy.point4': 'Local Preferences: We use cookies/local storage only to remember your theme and language settings.',

  'terms.title': 'Terms of Service',
  'terms.intro': 'By using Image Resizer Tool, you agree to the following terms:',
  'terms.point1': 'Fair Usage: You may use this tool for personal and commercial purposes.',
  'terms.point2': 'Ownership: You retain full copyright and ownership of all images you process.',
  'terms.point3': 'Liability: The tool is provided "as is". We are not responsible for any data loss, though highly unlikely given the local nature of the tool.',
  'terms.point4': 'Prohibited Use: Do not use this tool for processing illegal content.',
};

const hi: Dictionary = { ...en, 
  'brand.name': 'इमेज रीसाइज़र टूल', 
  'hero.title': 'सर्वश्रेष्ठ मुफ्त इमेज रीसाइज़र',
  'hero.subtitle': 'मुफ्त में पेशेवर गुणवत्ता के साथ अपनी छवियों का आकार बदलें, संपीड़ित करें और परिवर्तित करें।',
  'nav.tools': 'इमेज टूल्स',
  'editor.download': 'इमेज डाउनलोड करें'
};

const ur: Dictionary = { ...en, 'brand.name': 'امیج ریسائزر ٹول' };
const zh: Dictionary = { ...en, 'brand.name': '图像调整工具' };
const es: Dictionary = { ...en, 'brand.name': 'Herramienta de cambio de tamaño' };
const ar: Dictionary = { ...en, 'brand.name': 'أداة تغيير حجم الصورة' };

const DICTIONARIES: Record<string, Dictionary> = { en, hi, ur, zh, es, ar };

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string, params?: Record<string, string>): string => {
    let text = DICTIONARIES[language]?.[key];
    if (!text) text = DICTIONARIES['en'][key];
    if (!text) text = key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, v);
      });
    }
    return text;
  };

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};