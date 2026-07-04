-- ============================================================
-- نظام شراكة للمعدات الثقيلة — Schema الكامل
-- طبّق هذا الملف في Supabase SQL Editor
-- ============================================================

-- جدول 1: partners (الشركاء / الملاك)
CREATE TABLE IF NOT EXISTS partners (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name     TEXT NOT NULL,
  logo_url         TEXT,
  phone_primary    TEXT,
  phone_wa         TEXT,
  telegram_chat_id TEXT,
  currency         TEXT NOT NULL DEFAULT 'SAR',
  locale           TEXT NOT NULL DEFAULT 'ar',
  theme            TEXT NOT NULL DEFAULT 'light',
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- جدول 2: workers (السائقون / العمال)
CREATE TABLE IF NOT EXISTS workers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id    UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  full_name     TEXT NOT NULL,
  username      TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  phone         TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(partner_id, username)
);

-- جدول 3: equipment_types (أنواع المعدات)
CREATE TABLE IF NOT EXISTS equipment_types (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  name_en    TEXT,
  icon       TEXT
);

-- جدول 4: equipment (المعدات)
CREATE TABLE IF NOT EXISTS equipment (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id         UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  equipment_type_id  UUID REFERENCES equipment_types(id),
  assigned_worker_id UUID REFERENCES workers(id),
  plate_number       TEXT,
  model              TEXT,
  manufacture_year   INTEGER,
  notes              TEXT,
  is_active          BOOLEAN DEFAULT true,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- جدول 5: worker_contracts (نسب الشراكة)
CREATE TABLE IF NOT EXISTS worker_contracts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id        UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  worker_id         UUID REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
  profit_percentage NUMERIC(5,2) NOT NULL CHECK (profit_percentage > 0 AND profit_percentage < 100),
  effective_from    DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to      DATE,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- جدول 6: financial_cycles (الدورات المالية)
CREATE TABLE IF NOT EXISTS financial_cycles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id       UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  worker_id        UUID REFERENCES workers(id) NOT NULL,
  equipment_id     UUID REFERENCES equipment(id),
  title            TEXT,
  status           TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'settled')),
  started_at       TIMESTAMPTZ DEFAULT now(),
  settled_at       TIMESTAMPTZ,
  total_income     NUMERIC(12,2) DEFAULT 0,
  total_expenses   NUMERIC(12,2) DEFAULT 0,
  net_amount       NUMERIC(12,2) DEFAULT 0,
  partner_share    NUMERIC(12,2) DEFAULT 0,
  worker_share     NUMERIC(12,2) DEFAULT 0,
  worker_transfers NUMERIC(12,2) DEFAULT 0,
  partner_transfers NUMERIC(12,2) DEFAULT 0,
  worker_net       NUMERIC(12,2) DEFAULT 0,
  partner_net      NUMERIC(12,2) DEFAULT 0,
  currency         TEXT DEFAULT 'SAR',
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- جدول 7: transactions (المعاملات)
CREATE TABLE IF NOT EXISTS transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id    UUID REFERENCES financial_cycles(id) ON DELETE CASCADE NOT NULL,
  partner_id  UUID REFERENCES partners(id) NOT NULL,
  worker_id   UUID REFERENCES workers(id) NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer_to_partner', 'transfer_to_worker')),
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  recorded_by TEXT NOT NULL CHECK (recorded_by IN ('partner', 'worker')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE partners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_types   ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment         ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_contracts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_cycles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions      ENABLE ROW LEVEL SECURITY;

-- Policies: partners يرى بياناته فقط
CREATE POLICY "partners_own" ON partners
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "workers_own" ON workers
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "equipment_types_own" ON equipment_types
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "equipment_own" ON equipment
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "contracts_own" ON worker_contracts
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "cycles_own" ON financial_cycles
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

CREATE POLICY "transactions_own" ON transactions
  FOR ALL USING (
    partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid())
  );

-- ============================================================
-- Function: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
