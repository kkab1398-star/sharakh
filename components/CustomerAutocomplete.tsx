"use client";

import { useEffect, useRef, useState } from 'react';

interface Customer { id: string; full_name: string; phone: string; }

interface Props {
  label: string;
  field: 'name' | 'phone';
  value: string;
  onChange: (value: string) => void;
  onSelect: (customer: Customer) => void;
  placeholder?: string;
  minChars?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  dir?: 'rtl' | 'ltr';
}

export default function CustomerAutocomplete({ label, field, value, onChange, onSelect, placeholder, minChars, inputMode, dir = 'rtl' }: Props) {
  const threshold = minChars ?? (field === 'phone' ? 4 : 2);
  const [results, setResults] = useState<Customer[]>([]);
  const [open, setOpen]       = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < threshold) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/customers/search?q=${encodeURIComponent(value)}&field=${field}`);
        const data = await res.json();
        const list: Customer[] = data.customers ?? [];
        setResults(list); setOpen(list.length > 0);
      } catch { setResults([]); setOpen(false); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value, field, threshold]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSelect = (c: Customer) => { onSelect(c); setOpen(false); setResults([]); };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--cat-yellow)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder} inputMode={inputMode} dir={dir} autoComplete="off"
        style={{ height: 48, borderRadius: 2, border: '1px solid var(--cat-mid)', background: 'var(--cat-black)', color: 'var(--cat-white)', padding: '0 12px', fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => { (e.target as HTMLInputElement).style.border = '2px solid var(--cat-yellow)'; results.length > 0 && setOpen(true); }}
        onBlur={e => { (e.target as HTMLInputElement).style.border = '1px solid var(--cat-mid)'; }}
      />
      {open && (
        <ul style={{ position: 'absolute', zIndex: 100, width: '100%', marginTop: 2, background: 'var(--cat-gray)', border: '1px solid var(--cat-yellow)', borderRadius: 2, overflow: 'hidden', maxHeight: 200, overflowY: 'auto', listStyle: 'none', padding: 0 }}>
          {results.map(c => (
            <li key={c.id} onMouseDown={() => handleSelect(c)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--cat-mid)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cat-black)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ fontWeight: 700, color: 'var(--cat-white)', fontSize: 13 }}>{c.full_name}</span>
              <span style={{ fontSize: 11, color: 'var(--cat-muted)', fontFamily: 'monospace' }} dir="ltr">{c.phone}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
