-- جدول العملاء/الزبائن — مرتبط بالشريك (tenant)
CREATE TABLE IF NOT EXISTS customers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  full_name  TEXT NOT NULL,
  phone      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(partner_id, phone)
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_own" ON customers
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

-- ربط المعاملة بعميل (اختياري — حقل مساعد للبحث والتقارير)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS customer_id   UUID REFERENCES customers(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS customer_phone TEXT;
