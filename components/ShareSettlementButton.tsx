"use client";

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SettlementReportPdf from './SettlementReportPdf';
import type { FinancialCycle, Partner } from '@/types';

interface Props {
  cycle: FinancialCycle;
  partner: Partner;
  workerName: string;
  onReportReady?: (url: string) => void;
}

export default function ShareSettlementButton({ cycle, partner, workerName, onReportReady }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy]         = useState(false);
  const [copied, setCopied]     = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(cycle.report_url ?? null);
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const shareText =
    `📑 تسوية مالية — ${workerName}\n` +
    `الفترة: ${new Date(cycle.started_at).toLocaleDateString('en-US')} — ${cycle.settled_at ? new Date(cycle.settled_at).toLocaleDateString('en-US') : ''}\n` +
    `صافي الدورة: ${Number(cycle.net_amount).toLocaleString('en-US')} ${cycle.currency}\n` +
    `نصيب المالك: ${Number(cycle.partner_net).toLocaleString('en-US')} ${cycle.currency}\n` +
    `نصيب السائق: ${Number(cycle.worker_net).toLocaleString('en-US')} ${cycle.currency}`;

  const ensureReportUrl = async (): Promise<string | null> => {
    if (reportUrl) return reportUrl;
    if (!reportRef.current) return null;

    setBusy(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const blob = pdf.output('blob');

      const formData = new FormData();
      formData.append('file', blob, 'settlement.pdf');

      const res = await fetch(`/api/cycles/${cycle.id}/report`, { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok && data.report_url) {
        setReportUrl(data.report_url);
        onReportReady?.(data.report_url);
        return data.report_url;
      }
      return null;
    } catch (err) {
      console.error('[ShareSettlementButton] فشل توليد/رفع التقرير:', err);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const url = await ensureReportUrl();
    const text = url ? `${shareText}\n\n📄 تحميل التقرير الكامل: ${url}` : shareText;

    if (canShare) {
      try {
        await navigator.share({ title: 'تقرير تسوية مالية', text });
      } catch {
        // المستخدم ألغى المشاركة — لا حاجة لأي إجراء
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLink = async () => {
    const url = await ensureReportUrl();
    await navigator.clipboard.writeText(url ?? shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* القالب مخفي تماماً عن المستخدم — يُستخدم فقط لالتقاط صورة منه عند الحاجة */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
            <SettlementReportPdf ref={reportRef} cycle={cycle} partner={partner} workerName={workerName} />
          </div>,
          document.body
        )}

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {busy ? '⏳ جاري التجهيز...' : canShare ? '📤 مشاركة التسوية' : '🔗 نسخ ملخص التسوية'}
        </button>

        {!canShare && (
          <button
            type="button"
            onClick={handleCopyLink}
            disabled={busy}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition disabled:opacity-50"
          >
            🔗 نسخ رابط التقرير
          </button>
        )}

        {copied && <span className="text-xs text-emerald-600 font-bold">تم النسخ ✅</span>}
      </div>
    </>
  );
}
