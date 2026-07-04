"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import {
  type DriverLang, type DriverMessages, type LangMeta,
  LANG_META, getDriverLang, setDriverLang, t,
} from '@/lib/driver-i18n';

interface DriverLangCtx {
  lang: DriverLang;
  meta: LangMeta;
  m: DriverMessages;
  setLang: (l: DriverLang) => void;
  dir: 'rtl' | 'ltr';
}

const Ctx = createContext<DriverLangCtx>({
  lang: 'ar', meta: LANG_META.ar, m: t('ar'), setLang: () => {}, dir: 'rtl',
});

function loadGoogleFont(fontQuery: string | null) {
  const id = 'driver-gfont';
  let el = document.getElementById(id) as HTMLLinkElement | null;
  if (!fontQuery) { if (el) el.href = ''; return; }
  if (!el) {
    el = document.createElement('link');
    el.id = id;
    el.rel = 'stylesheet';
    document.head.appendChild(el);
  }
  el.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
}

export function DriverLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<DriverLang>('ar');

  useEffect(() => {
    const saved = getDriverLang();
    setLangState(saved);
    loadGoogleFont(LANG_META[saved].googleFont);
  }, []);

  const changeLang = (l: DriverLang) => {
    setDriverLang(l);
    setLangState(l);
    loadGoogleFont(LANG_META[l].googleFont);
  };

  const meta = LANG_META[lang];

  return (
    <Ctx.Provider value={{ lang, meta, m: t(lang), setLang: changeLang, dir: meta.dir }}>
      <style>{`
        .driver-app, .driver-app * { font-family: ${meta.fontFamily}; }
      `}</style>
      {children}
    </Ctx.Provider>
  );
}

export const useDriverLang = () => useContext(Ctx);
