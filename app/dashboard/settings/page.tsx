"use client";

import { useEffect, useRef, useState } from 'react';
import type { Partner } from '@/types';
import { getSubscriptionState } from '@/lib/subscription';
import { useTheme } from '@/lib/theme-context';

interface PartnerFull extends Partner {
  subscription_status?: string;
  plan?: string;
  trial_ends_at?: string | null;
  subscription_ends_at?: string | null;
}

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any,
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
};
const INPUT: React.CSSProperties = {
  height: 48, borderRadius: 2, border: '1px solid #3D3D3D',
  background: '#1A1A1A', color: '#FFFFFF', padding: '0 12px',
  fontSize: 14, width: '100%', outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Cairo', sans-serif",
};
const CARD: React.CSSProperties = {
  background: '#2A2A2A', borderRadius: 4, marginBottom: 16, overflow: 'hidden',
};
const CARD_HEAD: React.CSSProperties = {
  borderBottom: '1px solid #3D3D3D', padding: '14px 20px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

export default function SettingsPage() {
  const [partner, setPartner] = useState<PartnerFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);
  const [linking,  setLinking]  = useState(false);
  const [linkMsg,  setLinkMsg]  = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview,   setLogoPreview]   = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    company_name: '', phone_primary: '', phone_wa: '', currency: 'SAR', locale: 'ar',
    address: '', instagram: '', x_account: '', snapchat: '',
  });

  useEffect(() => {
    fetch('/api/partners/me')
      .then(r => r.json())
      .then(d => {
        if (d.partner) {
          const p: PartnerFull = d.partner;
          setPartner(p);
          setLogoPreview(p.logo_url ?? null);
          setForm({
            company_name:  p.company_name  ?? '',
            phone_primary: p.phone_primary ?? '',
            phone_wa:      p.phone_wa      ?? '',
            currency:      p.currency      ?? 'SAR',
            locale:        p.locale        ?? 'ar',
            address:       (p as any).address   ?? '',
            instagram:     (p as any).instagram  ?? '',
            x_account:       (p as any).x_account    ?? '',
            snapchat:      (p as any).snapchat   ?? '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  // ── رفع اللوغو ──────────────────────────────────────
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setLogoUploading(true);
    const fd = new FormData();
    fd.append('logo', file);
    const res  = await fetch('/api/partners/me/logo', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setPartner(p => p ? { ...p, logo_url: data.logo_url } : p);
    else        setLogoPreview(partner?.logo_url ?? null);
    setLogoUploading(false);
  };

  const removeLogo = async () => {
    await fetch('/api/partners/me/logo', { method: 'DELETE' });
    setLogoPreview(null);
    setPartner(p => p ? { ...p, logo_url: null } : p);
  };

  // ── تيليجرام ────────────────────────────────────────
  const linkCode = partner ? partner.id.slice(0, 8).toUpperCase() : '';

  const verifyTelegramLink = async () => {
    setLinking(true); setLinkMsg(null);
    const res  = await fetch('/api/telegram/link', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setLinkMsg({ type: 'ok', text: 'تم ربط تيليجرام بنجاح ✅' });
      setPartner(p => p ? { ...p, telegram_chat_id: data.chat_id } : p);
    } else {
      setLinkMsg({ type: 'err', text: data.error ?? 'لم يُعثر على الرمز في تيليجرام، تأكد أنك أرسلت الرمز للبوت' });
    }
    setLinking(false);
  };

  const unlinkTelegram = async () => {
    if (!confirm('إلغاء ربط تيليجرام؟')) return;
    await fetch('/api/telegram/link', { method: 'DELETE' });
    setPartner(p => p ? { ...p, telegram_chat_id: null } : p);
    setLinkMsg(null);
  };

  // ── حفظ الإعدادات ───────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/partners/me', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  const { theme, toggleTheme } = useTheme();

  // ── حالة الاشتراك ────────────────────────────────────
  const subState = partner ? getSubscriptionState(partner) : null;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: '#A0A0A0', fontFamily: "'Cairo', sans-serif" }}>...</p>
    </div>
  );

  return (
    <div style={{ padding: '24px 24px 60px', maxWidth: 680, fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>

      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.3px' }}>الإعدادات</h1>
        <p style={{ fontSize: 12, color: '#A0A0A0', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          بيانات الشركة وتفضيلات النظام
        </p>
      </div>

      {saved && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRight: '4px solid #22c55e', padding: '12px 16px', marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#22c55e', borderRadius: 2 }}>
          ✓ تم حفظ الإعدادات
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* ── اللوغو ────────────────────────────── */}
        <div style={CARD}>
          <div style={CARD_HEAD}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🖼 شعار الشركة
            </span>
          </div>
          <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Preview */}
            <div style={{
              width: 80, height: 80, background: '#1A1A1A', borderRadius: 4,
              border: '2px dashed #3D3D3D', display: 'flex', alignItems: 'center',
              justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
            }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: 28, color: '#3D3D3D' }}>🏢</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: '#A0A0A0', margin: '0 0 12px' }}>
                PNG أو JPG أو SVG — الحد الأقصى 2MB
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => logoRef.current?.click()} disabled={logoUploading}
                  style={{ height: 36, padding: '0 16px', background: '#FFCD11', color: '#1A1A1A', border: 'none', borderRadius: 0, fontWeight: 900, fontSize: 12, cursor: 'pointer', fontFamily: "'Cairo', sans-serif", textTransform: 'uppercase' }}>
                  {logoUploading ? 'جاري الرفع...' : 'رفع شعار'}
                </button>
                {logoPreview && (
                  <button type="button" onClick={removeLogo}
                    style={{ height: 36, padding: '0 14px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 0, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
                    حذف
                  </button>
                )}
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
            </div>
          </div>
        </div>

        {/* ── بيانات الشركة ─────────────────────── */}
        <div style={CARD}>
          <div style={CARD_HEAD}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🏢 بيانات الشركة</span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={LABEL}>اسم الشركة *</label>
              <input required value={form.company_name} onChange={e => set('company_name', e.target.value)}
                placeholder="شركة النقل الذهبي" style={INPUT}
                onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL}>هاتف رئيسي</label>
                <input value={form.phone_primary} onChange={e => set('phone_primary', e.target.value)}
                  placeholder="0533232500" dir="ltr" style={INPUT}
                  onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                  onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
              </div>
              <div>
                <label style={LABEL}>واتساب (مع الكود)</label>
                <input value={form.phone_wa} onChange={e => set('phone_wa', e.target.value)}
                  placeholder="966533232500" dir="ltr" style={INPUT}
                  onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                  onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
              </div>
            </div>
          </div>
        </div>

        {/* ── العنوان والسوشيال ─────────────────── */}
        <div style={CARD}>
          <div style={CARD_HEAD}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>📍 العنوان وحسابات التواصل</span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={LABEL}>العنوان</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="المنطقة الصناعية، الرياض" style={INPUT}
                onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL}>📸 Instagram</label>
                <input value={form.instagram} onChange={e => set('instagram', e.target.value)}
                  placeholder="username" dir="ltr" style={INPUT}
                  onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                  onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
              </div>
              <div>
                <label style={LABEL}>𝕏 Twitter</label>
                <input value={form.x_account} onChange={e => set('x_account', e.target.value)}
                  placeholder="username" dir="ltr" style={INPUT}
                  onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                  onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
              </div>
              <div>
                <label style={LABEL}>👻 Snapchat</label>
                <input value={form.snapchat} onChange={e => set('snapchat', e.target.value)}
                  placeholder="username" dir="ltr" style={INPUT}
                  onFocus={e => (e.target.style.border = '2px solid #FFCD11')}
                  onBlur={e => (e.target.style.border = '1px solid #3D3D3D')} />
              </div>
            </div>
          </div>
        </div>

        {/* ── العملة ────────────────────────────── */}
        <div style={CARD}>
          <div style={CARD_HEAD}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>💵 العملة الافتراضية</span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[
                { code: 'SAR', label: 'ريال سعودي', sym: 'ر.س' },
                { code: 'AED', label: 'درهم إماراتي', sym: 'د.إ' },
                { code: 'KWD', label: 'دينار كويتي', sym: 'د.ك' },
                { code: 'USD', label: 'دولار', sym: '$' },
              ].map(c => (
                <button key={c.code} type="button" onClick={() => set('currency', c.code)} style={{
                  padding: '12px 8px', border: form.currency === c.code ? '2px solid #FFCD11' : '1px solid #3D3D3D',
                  background: form.currency === c.code ? 'rgba(255,205,17,0.08)' : 'transparent',
                  color: form.currency === c.code ? '#FFCD11' : '#A0A0A0',
                  borderRadius: 2, cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{c.sym}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── رابط السائقين ─────────────────────── */}
        {partner && (
          <div style={CARD}>
            <div style={CARD_HEAD}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🚜 رابط دخول السائقين</span>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 12, color: '#A0A0A0', margin: '0 0 12px' }}>
                شارك هذا الرابط مع سائقيك حتى يتمكنوا من تسجيل الدخول
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{
                  flex: 1, background: '#1A1A1A', border: '1px solid #3D3D3D', borderRadius: 2,
                  padding: '10px 12px', fontSize: 11, color: '#A0A0A0', wordBreak: 'break-all',
                }} dir="ltr">
                  {typeof window !== 'undefined' ? `${window.location.origin}/driver/login?p=${partner.id}` : ''}
                </code>
                <button type="button"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/driver/login?p=${partner.id}`)}
                  style={{ height: 40, padding: '0 16px', background: '#FFCD11', color: '#1A1A1A', border: 'none', borderRadius: 0, fontWeight: 900, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Cairo', sans-serif' " }}>
                  نسخ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── تيليجرام ──────────────────────────── */}
        <div style={CARD}>
          <div style={CARD_HEAD}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>📲 إشعارات تيليجرام</span>
            {partner?.telegram_chat_id && (
              <span style={{ fontSize: 10, fontWeight: 900, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '3px 10px', letterSpacing: '0.08em' }}>
                مرتبط ✓
              </span>
            )}
          </div>
          <div style={{ padding: 20 }}>
            {partner?.telegram_chat_id ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 13, color: '#A0A0A0', margin: 0 }}>ستصلك إشعارات فورية لكل معاملة</p>
                <button type="button" onClick={unlinkTelegram}
                  style={{ height: 36, padding: '0 14px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 0, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
                  إلغاء الربط
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: '#1A1A1A', borderRight: '3px solid #FFCD11', padding: '12px 14px' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>رمز الربط</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'monospace', letterSpacing: 4 }}>{linkCode}</p>
                </div>
                <ol style={{ fontSize: 12, color: '#A0A0A0', paddingRight: 18, margin: 0, lineHeight: 2 }}>
                  <li>افتح البوت على تيليجرام: <strong style={{ color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any }}>@SharakhPartnerBot</strong></li>
                  <li>اضغط Start ثم أرسل الرمز أعلاه</li>
                  <li>اضغط "تحقق الآن" أدناه</li>
                </ol>
                {linkMsg && (
                  <div style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, borderRadius: 2, background: linkMsg.type === 'ok' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: linkMsg.type === 'ok' ? '#22c55e' : '#ef4444', border: `1px solid ${linkMsg.type === 'ok' ? '#22c55e' : '#ef4444'}` }}>
                    {linkMsg.text}
                  </div>
                )}
                <button type="button" onClick={verifyTelegramLink} disabled={linking}
                  style={{ height: 42, background: linking ? '#3D3D3D' : '#FFCD11', color: linking ? '#A0A0A0' : '#1A1A1A', border: 'none', borderRadius: 0, fontWeight: 900, fontSize: 13, cursor: linking ? 'not-allowed' : 'pointer', fontFamily: "'Cairo', sans-serif", textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {linking ? 'جاري التحقق...' : '🔄 تحقق الآن'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── حالة الاشتراك ──────────────────────── */}
        {subState && (
          <div style={CARD}>
            <div style={CARD_HEAD}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>⭐ الاشتراك</span>
              <span style={{
                fontSize: 10, fontWeight: 900, padding: '3px 10px', letterSpacing: '0.08em',
                color: subState.is_active ? '#22c55e' : '#ef4444',
                background: subState.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              }}>
                {subState.status === 'trial' ? 'تجريبي' : subState.status === 'active' ? 'نشط' : 'منتهي'}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              {subState.days_remaining !== null && subState.days_remaining > 0 && (
                <p style={{ fontSize: 13, color: subState.days_remaining <= 3 ? '#ef4444' : '#A0A0A0', margin: '0 0 8px' }}>
                  {subState.status === 'trial' ? '⏳ متبقي من التجربة:' : '📅 متبقي على الانتهاء:'}
                  {' '}<strong style={{ color: '#FFFFFF' }}>{subState.days_remaining} يوم</strong>
                </p>
              )}
              <p style={{ fontSize: 12, color: '#A0A0A0', margin: 0 }}>
                الخطة: <strong style={{ color: '#FFCD11', textShadow: 'var(--yellow-shadow)', WebkitTextStroke: 'var(--yellow-stroke)' as any }}>{subState.plan?.toUpperCase()}</strong>
              </p>
            </div>
          </div>
        )}

        {/* ── المظهر ────────────────────────────── */}
        <div style={{ ...CARD, marginTop: 16 }}>
          <div style={CARD_HEAD}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🎨 مظهر النظام
            </span>
            <span style={{ fontSize: 11, color: '#A0A0A0' }}>يُطبّق على لوحة المالك وواجهة السائق</span>
          </div>
          <div style={{ padding: 20, display: 'flex', gap: 12 }}>
            {(['dark', 'light'] as const).map(t => {
              const active = theme === t;
              const isDk   = t === 'dark';
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => { if (!active) toggleTheme(); }}
                  style={{
                    flex: 1, padding: '16px 12px', cursor: active ? 'default' : 'pointer',
                    background: active ? (isDk ? '#111' : '#F5F5F0') : '#1A1A1A',
                    border: active ? '2px solid #FFCD11' : '1px solid #3D3D3D',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* mini preview */}
                  <div style={{
                    width: 80, height: 48, background: isDk ? '#1A1A1A' : '#F5F5F0',
                    border: `2px solid ${isDk ? '#3D3D3D' : '#E0E0D8'}`,
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  }}>
                    <div style={{ height: 12, background: '#111111', borderBottom: '1px solid #FFCD11' }} />
                    <div style={{ flex: 1, display: 'flex', gap: 3, padding: 3 }}>
                      <div style={{ width: 16, background: isDk ? '#2A2A2A' : '#FFFFFF', borderLeft: '2px solid #FFCD11' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ height: 6, background: isDk ? '#2A2A2A' : '#FFFFFF', borderTop: '1px solid #FFCD11' }} />
                        <div style={{ height: 4, background: isDk ? '#3D3D3D' : '#E0E0D8' }} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 900, color: active ? '#FFCD11' : '#A0A0A0', margin: '0 0 2px', textAlign: 'center' }}>
                      {isDk ? '🌙 داكن' : '☀️ فاتح'}
                    </p>
                    <p style={{ fontSize: 10, color: '#555', margin: 0, textAlign: 'center' }}>
                      {isDk ? 'الوضع الافتراضي' : 'خلفية فاتحة'}
                    </p>
                  </div>
                  {active && (
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#1A1A1A', background: '#FFCD11', padding: '1px 8px' }}>
                      مفعّل
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Save button ───────────────────────── */}
        <button type="submit" disabled={saving} style={{
          width: '100%', height: 52, background: saving ? '#3D3D3D' : '#FFCD11',
          color: saving ? '#A0A0A0' : '#1A1A1A', border: 'none', borderRadius: 0,
          fontWeight: 900, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer',
          fontFamily: "'Cairo', sans-serif", textTransform: 'uppercase', letterSpacing: '0.04em',
        }}>
          {saving ? '⏳ جاري الحفظ...' : '💾 حفظ الإعدادات'}
        </button>
      </form>
    </div>
  );
}
