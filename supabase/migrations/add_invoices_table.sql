CREATE TABLE IF NOT EXISTS invoices (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id     UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  worker_id      UUID REFERENCES workers(id) NOT NULL,
  cycle_id       UUID REFERENCES financial_cycles(id) NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  customer_id    UUID REFERENCES customers(id),
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  amount         NUMERIC(12,2) NOT NULL,
  description    TEXT,
  currency       TEXT DEFAULT 'SAR',
  pdf_url        TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_own" ON invoices
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );
