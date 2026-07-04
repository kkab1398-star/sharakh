-- إضافة حقل التجميد لجدول workers
ALTER TABLE workers ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT false;
