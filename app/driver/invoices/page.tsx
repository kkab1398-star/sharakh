"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { currencySymbol } from '@/lib/currency';
import { useDriverLang } from '@/contexts/DriverLangContext';
import { generateInvoiceText } from '@/lib/invoice';

interface Invoice { id: string; customer_name: string; customer_phone: string; amount: number; description: string | null; created_at: string; currency: string; }
interface WorkerInfo { full_name: string; company_name: string; }

export default function DriverInvoices() {
  const router = useRouter();
  const { m, dir, meta } = useDriverLang();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [worker, setWorker]     = useState<WorkerInfo | null>(null);

  useEffect(() => {
    try { const s = sessionStorage.getItem('worker'); if (s) setWorker(JSON.parse(s)); } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/worker/invoices');
      if (r.status === 401) { router.replace('/driver/login'); return; }
      const data = await r.json();
      setInvoices(data.invoices ?? []);
      setLoading(false);
    })();
  }, [router]);

  const shareInvoice = async (inv: Invoice) => {
    setPdfLoading(inv.id);
    try {
      const res  = await fetch(`/api/invoices/${inv.id}/pdf`);
      const data = await res.json();
      const url  = data.pdf_url as string | undefined;
      if (url && navigator.share) {
        try { await navigator.share({ title: 'فاتورة', url }); } catch {}
      } else if (url) {
        await navigator.clipboard.writeText(url);
        setCopied(inv.id);
        setTimeout(() => setCopied(null), 2000);
      } else {
        // fallback: text
        const text = generateInvoiceText({
          invoiceNumber: inv.id.slice(0, 8).toUpperCase(),
          companyName:   worker?.company_name ?? 'SHARAKH',
          customerName:  inv.customer_name,
          customerPhone: inv.customer_phone,
          subtotal:      inv.amount,
          currency:      inv.currency,
          description:   inv.description ?? 'خدمة',
          workerName:    worker?.full_name ?? '',
          date:          inv.created_at,
        });
        if (navigator.share) { try { await navigator.share({ title: 'فاتورة', text }); } catch {} }
        else {
          await navigator.clipboard.writeText(text);
          setCopied(inv.id);
          setTimeout(() => setCopied(null), 2000);
        }
      }
    } finally {
      setPdfLoading(null);
    }
  };

  const downloadPDF = async (inv: Invoice) => {
    setPdfLoading(inv.id);
    try {
      const res  = await fetch(`/api/invoices/${inv.id}/pdf`);
      const data = await res.json();
      if (data.pdf_url) window.open(data.pdf_url, '_blank');
    } finally {
      setPdfLoading(null);
    }
  };

  return (
    <div style={{ fontFamily: meta.fontFamily, background: '#1A1A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#111111', borderBottom: '3px solid #FFCD11', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <h1 style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
          🧾 {m.invoices.title}
        </h1>
        <button
          onClick={() => router.push('/driver/invoices/new')}
          style={{
            background: '#FFCD11',
            color: '#1A1A1A',
            border: 'none',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: meta.fontFamily,
            transition: 'all 0.2s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          + جديدة
        </button>
      </header>

      <div style={{ flex: 1, padding: '16px', maxWidth: 430, margin: '0 auto', width: '100%', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#A0A0A0' }}>
            <div style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid #FFCD11', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ marginTop: 12 }}>{m.invoices.loading ?? 'جاري التحميل...'}</p>
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ background: '#2A2A2A', border: '2px solid #3D3D3D', borderRadius: 12, padding: 40, textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>🧾</p>
            <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 15, margin: '0 0 6px' }}>{m.invoices.empty}</p>
            <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }}>{m.invoices.emptyHint}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {invoices.map((inv, idx) => {
              const sym = currencySymbol(inv.currency);
              const ok  = copied === inv.id;
              return (
                <div
                  key={inv.id}
                  dir={dir}
                  style={{
                    background: '#2A2A2A',
                    borderRadius: 8,
                    borderTop: '4px solid #FFCD11',
                    padding: 16,
                    animation: `slideUp 0.4s ease-out ${idx * 0.05}s backwards`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: '#FFFFFF', margin: '0 0 2px' }}>{inv.customer_name}</p>
                      <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }} dir="ltr">{inv.customer_phone}</p>
                    </div>
                    <div style={{ textAlign: 'end' }}>
                      <p style={{ fontSize: 20, fontWeight: 900, color: '#FFCD11', margin: '0 0 2px', fontFamily: "'Barlow Condensed', inherit" }} dir="ltr">
                        {Number(inv.amount).toLocaleString('en-US')} {sym}
                      </p>
                      <p style={{ fontSize: 10, color: '#A0A0A0', margin: 0 }} dir="ltr">
                        {new Date(inv.created_at).toLocaleDateString('en-US')}
                      </p>
                    </div>
                  </div>

                  {inv.description && (
                    <div style={{ background: '#1A1A1A', borderRight: '3px solid #FFCD11', padding: '8px 12px', marginBottom: 12, borderRadius: 4 }}>
                      <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }}>{inv.description}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => shareInvoice(inv)}
                      style={{
                        flex: 1,
                        height: 40,
                        borderRadius: 4,
                        background: ok ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                        border: ok ? '2px solid #22c55e' : '2px solid #3D3D3D',
                        color: ok ? '#22c55e' : '#FFCD11',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontFamily: meta.fontFamily,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {ok ? `✓ ${m.invoices.copied}` : `↑ ${m.invoices.share}`}
                    </button>
                    <button
                      onClick={() => downloadPDF(inv)}
                      disabled={pdfLoading === inv.id}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        background: 'transparent',
                        border: '2px solid #3D3D3D',
                        color: pdfLoading === inv.id ? '#A0A0A0' : '#FFFFFF',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: pdfLoading === inv.id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      title="تحميل PDF"
                      onMouseDown={(e) => {
                        if (!pdfLoading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)';
                      }}
                      onMouseUp={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                      }}
                    >
                      {pdfLoading === inv.id ? '⏳' : '⬇'}
                    </button>
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
