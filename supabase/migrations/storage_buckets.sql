-- ============================================================
-- إنشاء Supabase Storage Buckets الثلاثة + سياسات الوصول
-- طبّق هذا الملف في Supabase SQL Editor بعد complete_schema.sql
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('logos', 'logos', true),
  ('documents', 'documents', true),
  ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- ─── سياسات الوصول ────────────────────────────────────────────
-- Postgres لا يدعم CREATE POLICY IF NOT EXISTS، لذا نُسقط ثم نُنشئ لضمان قابلية إعادة التشغيل

DROP POLICY IF EXISTS "logos_public_read" ON storage.objects;
CREATE POLICY "logos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "logos_auth_upload" ON storage.objects;
CREATE POLICY "logos_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "documents_public_read" ON storage.objects;
CREATE POLICY "documents_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "documents_auth_upload" ON storage.objects;
CREATE POLICY "documents_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "reports_public_read" ON storage.objects;
CREATE POLICY "reports_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reports');

DROP POLICY IF EXISTS "reports_auth_upload" ON storage.objects;
CREATE POLICY "reports_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'reports' AND auth.role() = 'authenticated');
