-- ============================================================
-- Migration شاملة: إغلاق الفجوات بين الكود ومخطط قاعدة البيانات
-- طبّق هذا الملف في Supabase SQL Editor بعد schema.sql والـ migrations السابقة
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. أعمدة الاشتراك + إعدادات إضافية على partners
-- ────────────────────────────────────────────────────────────
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial'
    CHECK (subscription_status IN ('trial','active','expired','cancelled')),
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days'),
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS x_account TEXT,
  ADD COLUMN IF NOT EXISTS snapchat TEXT;

-- ────────────────────────────────────────────────────────────
-- 2. عمود total_advances على financial_cycles
-- ────────────────────────────────────────────────────────────
ALTER TABLE financial_cycles
  ADD COLUMN IF NOT EXISTS total_advances NUMERIC(12,2) DEFAULT 0;

-- ────────────────────────────────────────────────────────────
-- 3. جدول services كامل مع RLS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id    UUID REFERENCES partners(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  default_price NUMERIC(12,2) DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Postgres لا يدعم CREATE POLICY IF NOT EXISTS، لذا نُسقط ثم نُنشئ لضمان قابلية إعادة التشغيل
DROP POLICY IF EXISTS "services_own" ON services;
CREATE POLICY "services_own" ON services
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────
-- 4. جدول expense_types كامل مع RLS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expense_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  UUID REFERENCES partners(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  is_default  BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE expense_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "expense_types_own" ON expense_types;
CREATE POLICY "expense_types_own" ON expense_types
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

-- إدراج الأنواع الافتراضية (تُضاف عند تسجيل شريك جديد) — يتم في الكود وليس هنا

-- ────────────────────────────────────────────────────────────
-- 5. عمود invoice_number في invoices
-- ────────────────────────────────────────────────────────────
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS invoice_number TEXT;
