// lib/tenant-theme.ts
import { createAdminClient } from '@/lib/supabase-admin';

export interface TenantTheme {
  company_name:   string;
  logo_url:       string | null;
  currency:       string;
  locale:         string;
  phone_primary:  string | null;
  phone_wa:       string | null;
  // ألوان — يمكن تخصيصها مستقبلاً من إعدادات الشريك
  primary_color:  string;
  primary_dark:   string;
  bg_color:       string;
  surface_color:  string;
  text_color:     string;
  muted_color:    string;
}

export const DEFAULT_COLORS = {
  primary_color: '#FFCD11',
  primary_dark:  '#E6B800',
  bg_color:      '#111111',
  surface_color: '#2A2A2A',
  text_color:    '#FFFFFF',
  muted_color:   '#A0A0A0',
} as const;

export async function getTenantTheme(partnerId: string): Promise<TenantTheme | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('partners')
    .select('company_name, logo_url, currency, locale, phone_primary, phone_wa')
    .eq('id', partnerId)
    .single();

  if (!data) return null;

  return {
    ...DEFAULT_COLORS,
    company_name:  data.company_name,
    logo_url:      data.logo_url      ?? null,
    currency:      data.currency      ?? 'SAR',
    locale:        data.locale        ?? 'ar',
    phone_primary: data.phone_primary ?? null,
    phone_wa:      data.phone_wa      ?? null,
  };
}

// تحويل Theme → CSS Variables string للحقن في style=""
export function buildCSSVariables(theme: Partial<TenantTheme>): Record<string, string> {
  return {
    '--tenant-primary':  theme.primary_color  ?? DEFAULT_COLORS.primary_color,
    '--tenant-dark':     theme.primary_dark   ?? DEFAULT_COLORS.primary_dark,
    '--tenant-bg':       theme.bg_color       ?? DEFAULT_COLORS.bg_color,
    '--tenant-surface':  theme.surface_color  ?? DEFAULT_COLORS.surface_color,
    '--tenant-text':     theme.text_color     ?? DEFAULT_COLORS.text_color,
    '--tenant-muted':    theme.muted_color    ?? DEFAULT_COLORS.muted_color,
  };
}

export function cssVarsString(theme: Partial<TenantTheme>): string {
  return Object.entries(buildCSSVariables(theme))
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}

// للاستخدام في Server Components — يرجع style string جاهزاً
export async function getPartnerCSSVars(partnerId: string): Promise<string> {
  const theme = await getTenantTheme(partnerId);
  if (!theme) return cssVarsString({});
  return cssVarsString(theme);
}
