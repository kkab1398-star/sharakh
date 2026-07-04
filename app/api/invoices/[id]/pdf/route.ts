import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getAuthenticatedPartner } from '@/lib/auth';
import { getWorkerSession } from '@/lib/worker-auth';
import {
  generateInvoiceNumber,
  generateInvoiceBuffer,
  saveInvoiceToStorage,
  buildWhatsAppLink,
  type InvoiceData,
} from '@/lib/invoice';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: invoiceId } = await params;
  const admin = createAdminClient();

  // يقبل طلبات المالك والسائق
  let partnerId: string | null = null;

  const workerSession = await getWorkerSession(req);
  if (workerSession) {
    partnerId = workerSession.partner_id;
  } else {
    const { partner, error } = await getAuthenticatedPartner();
    if (error) return error;
    partnerId = partner.id;
  }

  // جلب بيانات الفاتورة
  const { data: inv, error: invErr } = await admin
    .from('invoices')
    .select('*, partners(company_name, logo_url, phone_primary, phone_wa, currency)')
    .eq('id', invoiceId)
    .eq('partner_id', partnerId)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: 'الفاتورة غير موجودة' }, { status: 404 });
  }

  // إذا كان PDF محفوظاً مسبقاً — أرجعه مباشرة
  if (inv.pdf_url) {
    return NextResponse.json({
      pdf_url:   inv.pdf_url,
      wa_link:   inv.customer_phone
        ? buildWhatsAppLink(inv.customer_phone, inv.pdf_url, inv.invoice_number ?? invoiceId.slice(0, 8))
        : null,
    });
  }

  // توليد رقم الفاتورة
  const { count } = await admin
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('partner_id', partnerId);

  const invoiceNumber = generateInvoiceNumber(partnerId, (count ?? 1));

  const partner = (inv as any).partners as {
    company_name: string; logo_url: string | null;
    phone_primary: string | null; phone_wa: string | null; currency: string;
  };

  const invoiceData: InvoiceData = {
    invoiceNumber,
    date:         inv.created_at,
    companyName:  partner.company_name,
    logoUrl:      partner.logo_url,
    phonePrimary: partner.phone_primary,
    phoneWa:      partner.phone_wa,
    customerName: inv.customer_name ?? 'عميل',
    customerPhone: inv.customer_phone ?? '',
    description:  inv.description ?? 'خدمة',
    subtotal:     Number(inv.amount),
    taxRate:      0,
    currency:     inv.currency ?? partner.currency ?? 'SAR',
    workerName:   '',
  };

  // توليد وحفظ PDF
  let pdfUrl: string;
  try {
    pdfUrl = await saveInvoiceToStorage(invoiceId, partnerId, invoiceData);
  } catch (e) {
    console.error('[invoices/pdf]', e);
    return NextResponse.json({ error: 'فشل توليد PDF' }, { status: 500 });
  }

  // حفظ URL + رقم الفاتورة في قاعدة البيانات
  await admin.from('invoices').update({
    pdf_url:        pdfUrl,
    invoice_number: invoiceNumber,
  }).eq('id', invoiceId);

  const waLink = inv.customer_phone
    ? buildWhatsAppLink(inv.customer_phone, pdfUrl, invoiceNumber)
    : null;

  return NextResponse.json({ pdf_url: pdfUrl, wa_link: waLink, invoice_number: invoiceNumber });
}
