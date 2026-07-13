"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currencySymbol } from '@/lib/currency';
import { useDriverLang } from '@/contexts/DriverLangContext';

interface Tx { id: string; type: string; amount: number; description: string | null; customer_name: string | null; created_at: string; }

const TYPE_CFG: Record<string, { color: string; label_en: string }> = {
  income:             { color: '#FFCD11', label_en: 'INCOME'    },
  expense:            { color: '#ef4444', label_en: 'EXPENSE'   },
  transfer_to_worker: { color: '#A0A0A0', label_en: 'ADVANCE'   },
  transfer_to_partner:{ color: '#3b82f6', label_en: 'TRANSFER'  },
};

export default function DriverTransactions() {
  const router = useRouter();
  const { m, dir, meta } = useDriverLang();
  const [txs, setTxs]         = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('SAR');

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/worker/cycles');
      if (r.status === 401) { router.replace('/driver/login'); return; }
      const { cycles } = await r.json();
      if (!cycles?.length) { setLoading(false); return; }
      setCurrency(cycles[0].currency ?? 'SAR');
      const r2   = await fetch(`/api/worker/transactions?cycle_id=${cycles[0].id}`);
      const data = await r2.json();
      setTxs(data.transactions ?? []);
      setLoading(false);
    })();
  }, [router]);

  const sym = currencySymbol(currency);

  return (
    <div style={{ fontFamily: meta.fontFamily, background: 'var(--cat-black)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#111111', borderBottom: '3px solid #FFCD11', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 10, height: '60px', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
          📝 {m.transactions.title}
        </h1>
      </header>

      <div style={{ flex: 1, padding: '16px', maxWidth: 430, margin: '0 auto', width: '100%', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--cat-muted)' }}>
            <div style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: 12 }}>{m.transactions.loading ?? 'جاري التحميل...'}</p>
          </div>
        ) : txs.length === 0 ? (
          <div style={{ background: '#2A2A2A', border: '2px solid #3D3D3D', borderRadius: 12, padding: 40, textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>📋</p>
            <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 15, margin: 0 }}>{m.transactions.empty}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {txs.map((tx, idx) => {
              const cfg   = TYPE_CFG[tx.type] ?? { color: '#A0A0A0', label_en: tx.type.toUpperCase() };
              const label = m.transactions.types[tx.type as keyof typeof m.transactions.types] ?? tx.type;
              const sign  = tx.type === 'income' ? '+' : '-';
              return (
                <div
                  key={tx.id}
                  dir={dir}
                  style={{
                    background: '#2A2A2A',
                    borderRadius: 8,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    borderRight: `4px solid ${cfg.color}`,
                    animation: `slideUp 0.4s ease-out ${idx * 0.05}s backwards`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{label}</p>
                    {tx.description   && <p style={{ fontSize: 12, color: '#A0A0A0', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>}
                    {tx.customer_name && <p style={{ fontSize: 11, color: '#A0A0A0', margin: 0 }}>👤 {tx.customer_name}</p>}
                  </div>
                  <div style={{ textAlign: 'end', flexShrink: 0 }}>
                    <p style={{ fontSize: 16, fontWeight: 900, color: cfg.color, margin: '0 0 2px', fontFamily: "'Barlow Condensed', inherit" }} dir="ltr">
                      {sign}{Number(tx.amount).toLocaleString('en-US')} {sym}
                    </p>
                    <p style={{ fontSize: 10, color: '#A0A0A0', margin: 0 }} dir="ltr">
                      {new Date(tx.created_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
