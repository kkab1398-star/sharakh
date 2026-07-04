import ar from '@/messages/driver/ar.json';
import en from '@/messages/driver/en.json';
import ur from '@/messages/driver/ur.json';
import bn from '@/messages/driver/bn.json';
import ne from '@/messages/driver/ne.json';
import tl from '@/messages/driver/tl.json';

export type DriverLang = 'ar' | 'en' | 'ur' | 'bn' | 'ne' | 'tl';
export type DriverMessages = typeof ar;

const messages: Record<DriverLang, DriverMessages> = { ar, en, ur, bn, ne, tl };

export const DRIVER_LANG_KEY = 'driver_lang';

export interface LangMeta {
  code: DriverLang;
  label: string;     // اسم اللغة بلغتها
  dir: 'rtl' | 'ltr';
  fontFamily: string;
  googleFont: string | null; // رابط Google Fonts أو null للخط الافتراضي
}

export const LANG_META: Record<DriverLang, LangMeta> = {
  ar: { code: 'ar', label: 'عربي',    dir: 'rtl', fontFamily: "'Cairo', sans-serif",                  googleFont: 'Cairo:wght@400;600;700;900' },
  ur: { code: 'ur', label: 'اردو',    dir: 'rtl', fontFamily: "'Noto Nastaliq Urdu', serif",           googleFont: 'Noto+Nastaliq+Urdu:wght@400;700' },
  bn: { code: 'bn', label: 'বাংলা',   dir: 'ltr', fontFamily: "'Noto Sans Bengali', sans-serif",       googleFont: 'Noto+Sans+Bengali:wght@400;600;700' },
  ne: { code: 'ne', label: 'नेपाली',  dir: 'ltr', fontFamily: "'Noto Sans Devanagari', sans-serif",    googleFont: 'Noto+Sans+Devanagari:wght@400;600;700' },
  tl: { code: 'tl', label: 'Filipino', dir: 'ltr', fontFamily: "'Inter', sans-serif",                  googleFont: null },
  en: { code: 'en', label: 'English',  dir: 'ltr', fontFamily: "'Inter', sans-serif",                  googleFont: null },
};

export function getDriverLang(): DriverLang {
  if (typeof window === 'undefined') return 'ar';
  return (localStorage.getItem(DRIVER_LANG_KEY) as DriverLang) ?? 'ar';
}

export function setDriverLang(lang: DriverLang) {
  localStorage.setItem(DRIVER_LANG_KEY, lang);
}

export function t(lang: DriverLang): DriverMessages {
  return messages[lang] ?? messages.ar;
}
