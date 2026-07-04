// lib/invoice.ts
// توليد أرقام الفواتير، حساب المبالغ، PDF بـ @react-pdf/renderer، حفظ في Storage

import {
  Document, Page, Text, View, Image, StyleSheet, pdf, Font,
} from '@react-pdf/renderer';
import { createElement } from 'react';
import { createAdminClient } from '@/lib/supabase-admin';

// ─── تسجيل خط يدعم العربية ─────────────────────────────
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hL-Qav8Gh5MG.woff2',
});

// ─── 1. رقم الفاتورة ────────────────────────────────────
export function generateInvoiceNumber(partnerId: string, sequence: number): string {
  const prefix = partnerId.slice(0, 4).toUpperCase();
  const seq    = String(sequence).padStart(4, '0');
  const date   = new Date().toISOString().slice(2, 7).replace('-', '');
  return `${prefix}-${date}-${seq}`;
}

// ─── 2. حساب المبالغ ────────────────────────────────────
export function calculateInvoice(subtotal: number, taxRate = 0) {
  const tax   = +(subtotal * taxRate / 100).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { subtotal, taxRate, tax, total };
}

// ─── 3. رابط واتساب ─────────────────────────────────────
export function buildWhatsAppLink(phone: string, pdfUrl: string, invoiceNumber: string): string {
  const clean = phone.replace(/\D/g, '');
  const num   = clean.startsWith('0') ? `966${clean.slice(1)}` : clean;
  const text  = encodeURIComponent(`🧾 فاتورة رقم ${invoiceNumber}\n${pdfUrl}`);
  return `https://wa.me/${num}?text=${text}`;
}

// ─── 4. مساعدات ─────────────────────────────────────────
const SYM: Record<string, string> = { SAR: 'ر.س', AED: 'د.إ', USD: '$', KWD: 'د.ك' };
const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// ─── 5. بيانات الفاتورة ──────────────────────────────────
export interface InvoiceData {
  invoiceNumber:   string;
  date:            string;
  companyName:     string;
  logoUrl?:        string | null;
  phonePrimary?:   string | null;
  phoneWa?:        string | null;
  customerName:    string;
  customerPhone:   string;
  description:     string;
  subtotal:        number;
  taxRate?:        number;
  currency:        string;
  workerName:      string;
}

// ─── 6. Component PDF ────────────────────────────────────
const S = StyleSheet.create({
  page:        { fontFamily: 'Cairo', backgroundColor: '#fff', paddingBottom: 60 },
  header:      { backgroundColor: '#111111', padding: '28 36', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft:  { flexDirection: 'column' },
  companyName: { fontSize: 20, fontWeight: 900, color: '#FFCD11', letterSpacing: -0.5 },
  logo:        { height: 44, objectFit: 'contain' },
  invLabel:    { fontSize: 9, color: '#A0A0A0', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  invNumber:   { fontSize: 14, fontWeight: 900, color: '#FFCD11' },
  stripe:      { height: 4, backgroundColor: '#FFCD11' },
  body:        { padding: '24 36' },
  row2:        { flexDirection: 'row', gap: 16, marginBottom: 20 },
  box:         { flex: 1, backgroundColor: '#F5F5F5', padding: '14 16' },
  boxLabel:    { fontSize: 8, color: '#888', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, borderBottomWidth: 1.5, borderBottomColor: '#FFCD11', paddingBottom: 5 },
  boxTitle:    { fontSize: 13, fontWeight: 900, color: '#111', marginBottom: 3 },
  boxSub:      { fontSize: 11, color: '#555' },
  tableHead:   { backgroundColor: '#111', padding: '9 14', flexDirection: 'row', justifyContent: 'space-between' },
  tableHeadTx: { fontSize: 9, fontWeight: 900, color: '#FFCD11', letterSpacing: 1, textTransform: 'uppercase' },
  tableRow:    { borderWidth: 1, borderTopWidth: 0, borderColor: '#E5E5E5', padding: '14 14', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tableDesc:   { fontSize: 12, color: '#111', fontWeight: 600, flex: 1 },
  tableAmt:    { fontSize: 13, fontWeight: 900, color: '#111' },
  subRow:      { borderWidth: 1, borderTopWidth: 0, borderColor: '#E5E5E5', padding: '8 14', flexDirection: 'row', justifyContent: 'space-between' },
  subLabel:    { fontSize: 10, color: '#888' },
  subVal:      { fontSize: 10, color: '#111' },
  totalRow:    { backgroundColor: '#111', padding: '12 14', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:  { fontSize: 11, fontWeight: 900, color: '#FFCD11', letterSpacing: 1, textTransform: 'uppercase' },
  totalAmt:    { fontSize: 20, fontWeight: 900, color: '#FFCD11' },
  thanks:      { marginTop: 20, borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingTop: 16, alignItems: 'center' },
  thanksText:  { fontSize: 11, color: '#888' },
  footer:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', padding: '10 36', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTx:    { fontSize: 8, color: '#A0A0A0', letterSpacing: 1 },
  footerLine:  { width: 20, height: 2, backgroundColor: '#FFCD11' },
  dateBadge:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  dateLabel:   { fontSize: 8, color: '#888', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2 },
  dateVal:     { fontSize: 12, fontWeight: 700, color: '#111' },
  paidBadge:   { backgroundColor: '#22c55e', padding: '4 12' },
  paidTx:      { fontSize: 9, fontWeight: 900, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },
});

function InvoicePDF({ data }: { data: InvoiceData }) {
  const sym  = SYM[data.currency] ?? data.currency;
  const calc = calculateInvoice(data.subtotal, data.taxRate ?? 0);

  return createElement(Document, { title: `فاتورة ${data.invoiceNumber}` },
    createElement(Page, { size: 'A4', style: S.page },
      // Header
      createElement(View, { style: S.header },
        data.logoUrl
          ? createElement(Image, { src: data.logoUrl, style: S.logo })
          : createElement(Text, { style: S.companyName }, data.companyName),
        createElement(View, { style: S.headerLeft },
          createElement(Text, { style: S.invLabel }, 'INVOICE'),
          createElement(Text, { style: S.invNumber }, `# ${data.invoiceNumber}`),
        ),
      ),
      // Yellow stripe
      createElement(View, { style: S.stripe }),
      // Body
      createElement(View, { style: S.body },
        // Date + Paid badge
        createElement(View, { style: S.dateBadge },
          createElement(View, null,
            createElement(Text, { style: S.dateLabel }, 'التاريخ'),
            createElement(Text, { style: S.dateVal }, fmtDate(data.date)),
          ),
          createElement(View, { style: S.paidBadge },
            createElement(Text, { style: S.paidTx }, 'مدفوعة'),
          ),
        ),
        // Customer + Company
        createElement(View, { style: S.row2 },
          createElement(View, { style: S.box },
            createElement(Text, { style: S.boxLabel }, 'العميل'),
            createElement(Text, { style: S.boxTitle }, data.customerName),
            createElement(Text, { style: S.boxSub }, data.customerPhone),
          ),
          createElement(View, { style: S.box },
            createElement(Text, { style: S.boxLabel }, 'مقدّم الخدمة'),
            createElement(Text, { style: S.boxTitle }, data.companyName),
            createElement(Text, { style: S.boxSub }, data.workerName),
            data.phonePrimary
              ? createElement(Text, { style: S.boxSub }, data.phonePrimary)
              : null,
          ),
        ),
        // Table
        createElement(View, { style: S.tableHead },
          createElement(Text, { style: S.tableHeadTx }, 'الخدمة'),
          createElement(Text, { style: S.tableHeadTx }, 'المبلغ'),
        ),
        createElement(View, { style: S.tableRow },
          createElement(Text, { style: S.tableDesc }, data.description),
          createElement(Text, { style: S.tableAmt }, `${fmt(calc.subtotal)} ${sym}`),
        ),
        calc.tax > 0 && createElement(View, { style: S.subRow },
          createElement(Text, { style: S.subLabel }, `ضريبة ${calc.taxRate}%`),
          createElement(Text, { style: S.subVal }, `${fmt(calc.tax)} ${sym}`),
        ),
        createElement(View, { style: S.totalRow },
          createElement(Text, { style: S.totalLabel }, 'الإجمالي'),
          createElement(Text, { style: S.totalAmt }, `${fmt(calc.total)} ${sym}`),
        ),
        // Thanks
        createElement(View, { style: S.thanks },
          createElement(Text, { style: S.thanksText }, 'شكراً لتعاملكم معنا'),
        ),
      ),
      // Footer
      createElement(View, { style: S.footer },
        createElement(Text, { style: S.footerTx }, 'POWERED BY SHARAKH'),
        createElement(View, { style: S.footerLine }),
      ),
    ),
  );
}

// ─── 7. توليد PDF Buffer ─────────────────────────────────
export async function generateInvoiceBuffer(data: InvoiceData): Promise<Buffer> {
  const doc    = createElement(InvoicePDF, { data });
  const stream = await pdf(doc).toBuffer();
  return stream;
}

// ─── 8. حفظ في Supabase Storage ورجوع URL ────────────────
export async function saveInvoiceToStorage(
  invoiceId: string,
  partnerId: string,
  data: InvoiceData,
): Promise<string> {
  const admin  = createAdminClient();
  const buffer = await generateInvoiceBuffer(data);
  const path   = `invoices/${partnerId}/${invoiceId}.pdf`;

  const { error } = await admin.storage
    .from('documents')
    .upload(path, buffer, {
      contentType:  'application/pdf',
      upsert:       true,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: urlData } = admin.storage.from('documents').getPublicUrl(path);
  return urlData.publicUrl;
}

// ─── 9. نص واتساب بديل (بدون PDF) ───────────────────────
export function generateInvoiceText(data: InvoiceData): string {
  const sym  = SYM[data.currency] ?? data.currency;
  const calc = calculateInvoice(data.subtotal, data.taxRate ?? 0);
  return [
    `🧾 فاتورة — ${data.companyName}`,
    `────────────────────`,
    `# ${data.invoiceNumber}`,
    `👤 الزبون: ${data.customerName}`,
    `📱 الجوال: ${data.customerPhone}`,
    `📋 الخدمة: ${data.description}`,
    `💵 المبلغ: ${fmt(calc.total)} ${sym}`,
    `📅 التاريخ: ${fmtDate(data.date)}`,
    data.phoneWa ? `📲 تواصل: wa.me/${data.phoneWa.replace(/\D/g, '')}` : '',
  ].filter(Boolean).join('\n');
}
