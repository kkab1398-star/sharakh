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
    <div style={{ fontFamily: meta.fontFamily, background: 'var(--cat-black)', minHeight: '100%' }}>
      <header style={{ background: 'var(--cat-dark)', borderBottom: '3px solid var(--cat-yellow)', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 16, fontWeight: 900, color: 'var(--cat-white)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>{m.invoices.title}</h1>
        <button
          onClick={() => router.push('/driver/invoices/new')}
          style={{
            background: 'var(--cat-yellow)',
            color: 'var(--cat-black)',
            border: 'none',
            borderRadius: 0,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: meta.fontFamily,
          }}
        >
          + جديدة
        </button>
      </header>

      <div style={{ padding: 16, maxWidth: 430, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--cat-muted)' }}>...</div>
        ) : invoices.length === 0 ? (
          <div style={{ background: 'var(--cat-gray)', border: '1px solid var(--cat-mid)', borderRadius: 2, padding: 40, textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 36, margin: '0 0 12px' }}>🧾</p>
            <p style={{ fontWeight: 700, color: 'var(--cat-white)', fontSize: 15, margin: '0 0 6px' }}>{m.invoices.empty}</p>
            <p style={{ fontSize: 12, color: 'var(--cat-muted)', margin: 0 }}>{m.invoices.emptyHint}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {invoices.map(inv => {
              const sym = currencySymbol(inv.currency);
              const ok  = copied === inv.id;
              return (
                <div key={inv.id} dir={dir} style={{ background: 'var(--cat-gray)', borderRadius: 2, borderTop: '3px solid var(--cat-yellow)', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 900, color: 'var(--cat-white)', margin: '0 0 2px' }}>{inv.customer_name}</p>
                      <p style={{ fontSize: 12, color: 'var(--cat-muted)', margin: 0 }} dir="ltr">{inv.customer_phone}</p>
                    </div>
                    <div style={{ textAlign: 'end' }}>
                      <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--cat-yellow)', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: '0 0 2px', fontFamily: "'Barlow Condensed', inherit" }} dir="ltr">
                        {Number(inv.amount).toLocaleString('en-US')} {sym}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--cat-muted)', margin: 0 }} dir="ltr">{new Date(inv.created_at).toLocaleDateString('en-US')}</p>
                    </div>
                  </div>

                  {inv.description && (
                    <div style={{ background: 'var(--cat-black)', borderRight: '2px solid var(--cat-mid)', padding: '8px 12px', marginBottom: 12 }}>
                      <p style={{ fontSize: 12, color: 'var(--cat-muted)', margin: 0 }}>{inv.description}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => shareInvoice(inv)} style={{
                      flex: 1, height: 40, borderRadius: 0,
                      background: ok ? 'rgba(34,197,94,0.1)' : 'transparent',
                      border: ok ? '1px solid var(--cat-green)' : '1px solid var(--cat-mid)',
                      color: ok ? 'var(--cat-green)' : 'var(--cat-yellow)',
                      fontWeight: 700, fontSize: 12, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: meta.fontFamily,
                    }}>
                      {ok ? `✓ ${m.invoices.copied}` : `↑ ${m.invoices.share}`}
                    </button>
                    <button onClick={() => downloadPDF(inv)} disabled={pdfLoading === inv.id} style={{
                      width: 40, height: 40, borderRadius: 0,
                      background: 'transparent',
                      border: '1px solid var(--cat-mid)',
                      color: pdfLoading === inv.id ? 'var(--cat-muted)' : 'var(--cat-white)',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }} title="تحميل PDF">
                      {pdfLoading === inv.id ? '…' : '⬇'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
