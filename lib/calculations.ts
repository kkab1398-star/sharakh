// lib/calculations.ts
import type { Transaction, WorkerContract, SettlementResult } from '@/types';

/**
 * خوارزمية التسوية المالية — قلب نظام "شراكة"
 */
export function calculateSettlement(
  transactions: Transaction[],
  contract: WorkerContract,
  cycleId: string,
  currency: string
): SettlementResult {

  // 1. جمع الدخل الكلي
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 2. جمع المصاريف الكلية
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 3. الصافي (الدخل - المصاريف)
  const netAmount = totalIncome - totalExpenses;

  // 4. تطبيق نسب الشراكة
  const workerPercentage  = contract.profit_percentage;
  const partnerPercentage = 100 - workerPercentage;

  // 5. حساب الحصص
  const workerShare  = (netAmount * workerPercentage)  / 100;
  const partnerShare = (netAmount * partnerPercentage) / 100;

  // 6. التحويلات خلال الدورة
  // السلف من المالك للسائق (تخصم من حصة السائق)
  const workerTransfers = transactions
    .filter(t => t.type === 'transfer_to_worker')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // التحويلات من السائق للمالك (تخصم من حصة المالك)
  const partnerTransfers = transactions
    .filter(t => t.type === 'driver_to_partner_transfer')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // 7. الصافي النهائي لكل طرف بعد خصم التحويلات
  // السائق: حصته - السلف التي أخذها من المالك
  const workerNet  = workerShare  - workerTransfers;
  // المالك: حصته - التحويلات التي استقبلها من السائق
  const partnerNet = partnerShare - partnerTransfers;

  return {
    cycle_id:          cycleId,
    total_income:      round(totalIncome),
    total_expenses:    round(totalExpenses),
    net_amount:        round(netAmount),
    worker_percentage: workerPercentage,
    partner_percentage: partnerPercentage,
    worker_share:      round(workerShare),
    partner_share:     round(partnerShare),
    worker_transfers:  round(workerTransfers),
    partner_transfers: round(partnerTransfers),
    worker_net:        round(workerNet),
    partner_net:       round(partnerNet),
    currency,
  };
}

// دالة تقريب مالي دقيقة
function round(value: number): number {
  return Math.round(value * 100) / 100;
}