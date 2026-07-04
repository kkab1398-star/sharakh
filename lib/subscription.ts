// lib/subscription.ts
import { createAdminClient } from '@/lib/supabase-admin';

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';
export type SubscriptionPlan   = 'basic' | 'pro' | 'enterprise';

export interface SubscriptionState {
  status:               SubscriptionStatus;
  plan:                 SubscriptionPlan;
  is_active:            boolean;
  is_expired:           boolean;
  days_remaining:       number | null;
  trial_ends_at:        string | null;
  subscription_ends_at: string | null;
}

function daysUntil(date: string | null): number | null {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

export function getSubscriptionState(partner: {
  subscription_status?:  string | null;
  plan?:                 string | null;
  trial_ends_at?:        string | null;
  subscription_ends_at?: string | null;
}): SubscriptionState {
  const status = (partner.subscription_status as SubscriptionStatus) ?? 'trial';
  const plan   = (partner.plan as SubscriptionPlan) ?? 'basic';

  let is_active    = false;
  let is_expired   = false;
  let days_remaining: number | null = null;

  if (status === 'trial') {
    days_remaining = daysUntil(partner.trial_ends_at ?? null);
    is_active      = days_remaining === null || days_remaining > 0;
    is_expired     = !is_active;

  } else if (status === 'active') {
    days_remaining = daysUntil(partner.subscription_ends_at ?? null);
    is_active      = days_remaining === null || days_remaining > 0;
    is_expired     = !is_active;

  } else {
    // expired | cancelled
    is_active  = false;
    is_expired = true;
  }

  return {
    status:               is_expired && status !== 'cancelled' ? 'expired' : status,
    plan,
    is_active,
    is_expired,
    days_remaining,
    trial_ends_at:        partner.trial_ends_at        ?? null,
    subscription_ends_at: partner.subscription_ends_at ?? null,
  };
}

export function canAccessSystem(partner: Parameters<typeof getSubscriptionState>[0]): boolean {
  return getSubscriptionState(partner).is_active;
}

// للاستخدام في API routes — يجلب من DB ثم يتحقق
export async function assertActiveSubscription(
  partnerId: string,
): Promise<{ allowed: boolean; reason?: string; state?: SubscriptionState }> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('partners')
    .select('subscription_status, plan, trial_ends_at, subscription_ends_at')
    .eq('id', partnerId)
    .single();

  if (!data) return { allowed: false, reason: 'partner_not_found' };

  const state = getSubscriptionState(data);
  if (!state.is_active) return { allowed: false, reason: state.status, state };
  return { allowed: true, state };
}
