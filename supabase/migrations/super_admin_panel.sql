-- ============================================================
-- دعم لوحة السوبر أدمن: تجميد يدوي، ملاحظات خاصة، مدفوعات، سجل تدقيق
-- طبّق هذا الملف في Supabase SQL Editor بعد complete_schema.sql و storage_buckets.sql
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. partners: تجميد يدوي من المطوّر + ملاحظات خاصة (تظهر للسوبر أدمن فقط)
-- ────────────────────────────────────────────────────────────
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS is_frozen   BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- ────────────────────────────────────────────────────────────
-- 2. payments — سجل المدفوعات (تُدار حصراً عبر service role من lib/super-admin.ts)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id       UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  amount           NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency         TEXT NOT NULL DEFAULT 'SAR',
  method           TEXT NOT NULL CHECK (method IN ('transfer', 'cash', 'card')),
  reference_number TEXT,
  payment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  note             TEXT,
  status           TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending')),
  created_by       TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- عمداً بلا أي سياسة RLS هنا: الوصول محصور بمفتاح service role
-- (يُستخدم فقط داخل lib/super-admin.ts) — لا partner ولا worker يمكنه قراءتها مباشرة.

-- ────────────────────────────────────────────────────────────
-- 3. audit_log — سجل كل عملية يقوم بها السوبر أدمن
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email TEXT NOT NULL,
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- نفس المنطق: بلا سياسات RLS — service role فقط عبر lib/super-admin.ts.

CREATE INDEX IF NOT EXISTS idx_payments_partner_id   ON payments(partner_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at  ON audit_log(created_at DESC);
