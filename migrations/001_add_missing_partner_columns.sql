-- Migration: Add missing partner table columns
-- Date: 2026-07-13
-- Description: Add missing columns needed for tenant creation and profile management

-- Add missing columns to partners table
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true;

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS instagram TEXT;

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS x_account TEXT;

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS snapchat TEXT;

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- Ensure slug column exists and is unique
ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Update default values for existing records
UPDATE public.partners
SET is_first_login = true
WHERE is_first_login IS NULL;

UPDATE public.partners
SET subscription_status = 'trial'
WHERE subscription_status IS NULL;

-- Create index for slug to improve query performance
CREATE INDEX IF NOT EXISTS idx_partners_slug ON public.partners(slug);

-- Set trial end date for existing trial accounts (14 days from now)
UPDATE public.partners
SET trial_ends_at = NOW() + INTERVAL '14 days'
WHERE trial_ends_at IS NULL AND subscription_status = 'trial';

-- Add comment to table for documentation
COMMENT ON TABLE public.partners IS 'Tenant/Partner accounts in the system';

-- Add comments to new columns
COMMENT ON COLUMN public.partners.is_first_login IS 'Flag to indicate if this is the partner''s first login';
COMMENT ON COLUMN public.partners.address IS 'Physical address of the partner company';
COMMENT ON COLUMN public.partners.instagram IS 'Instagram social media handle';
COMMENT ON COLUMN public.partners.x_account IS 'X (Twitter) social media handle';
COMMENT ON COLUMN public.partners.snapchat IS 'Snapchat social media handle';
COMMENT ON COLUMN public.partners.subscription_status IS 'Current subscription status (trial, active, expired)';
COMMENT ON COLUMN public.partners.trial_ends_at IS 'Date when trial subscription ends';
COMMENT ON COLUMN public.partners.subscription_ends_at IS 'Date when paid subscription ends';
COMMENT ON COLUMN public.partners.slug IS 'URL-friendly slug for login link';
