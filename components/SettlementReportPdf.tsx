"use client";

import { forwardRef } from 'react';
import type { FinancialCycle, Partner } from '@/types';

interface Props {
  cycle: FinancialCycle;
  partner: Partner;
  workerName: string;
}

const fmt = (n: number) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// قالب HTML مخفي بالكامل عن المستخدم — يُستخدم فقط كمصدر لتحويل html2canvas إلى PDF
const SettlementReportPdf = forwardRef<HTMLDivElement, Props>(({ cycle, partner, workerName }, ref) => {
  const workerPct  = cycle.total_income > 0 ? Math.round((Number(cycle.worker_share) / Number(cycle.net_amount || 1)) * 100) : 0;
  const partnerPct = 100 - workerPct;

  return (
    <div
      ref={ref}
      dir="rtl"
      style={{
        width: '700px',
        padding: '40px',
        fontFamily: 'Tahoma, Arial, sans-serif',
        background: '#ffffff',
        color: '#1e293b',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #2563eb', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#1e293b' }}>{partner.company_name}</h1>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>تقرير تسوية مالية</p>
        </div>
        <div style={{ width: '48px', height: '48px', background: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '22px' }}>
          ش
        </div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px' }}>
        {cycle.title ?? `دورة بتاريخ ${new Date(cycle.started_at).toLocaleDateString('en-US')}`}
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>
        السائق: <b>{workerName}</b> · الفترة: {new Date(cycle.started_at).toLocaleDateString('en-US')} — {cycle.settled_at ? new Date(cycle.settled_at).toLocaleDateString('en-US') : '—'}
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <tbody>
          {[
            ['إجمالي الدخل', cycle.total_income, '#16a34a'],
            ['إجمالي المصاريف', cycle.total_expenses, '#dc2626'],
            ['صافي الدورة', cycle.net_amount, '#2563eb'],
          ].map(([label, val, color]) => (
            <tr key={label as string} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px 0', fontSize: '14px', fontWeight: 700 }}>{label}</td>
              <td style={{ padding: '10px 0', fontSize: '16px', fontWeight: 900, textAlign: 'left', color: color as string }}>
                {fmt(val as number)} {cycle.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: '#eef2ff', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#4338ca', fontWeight: 700, margin: '0 0 6px' }}>نصيب المالك ({partnerPct}%)</p>
          <p style={{ fontSize: '20px', color: '#3730a3', fontWeight: 900, margin: 0 }}>{fmt(cycle.partner_net)} {cycle.currency}</p>
        </div>
        <div style={{ flex: 1, background: '#ecfdf5', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#047857', fontWeight: 700, margin: '0 0 6px' }}>نصيب السائق ({workerPct}%)</p>
          <p style={{ fontSize: '20px', color: '#065f46', fontWeight: 900, margin: 0 }}>{fmt(cycle.worker_net)} {cycle.currency}</p>
        </div>
      </div>

      <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
        تم إصدار هذا التقرير تلقائياً عبر نظام شراكة بتاريخ {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  );
});

SettlementReportPdf.displayName = 'SettlementReportPdf';
export default SettlementReportPdf;
