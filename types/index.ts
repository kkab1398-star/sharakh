// types/index.ts

export type UserRole = 'partner' | 'worker';

export interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  phone_primary: string | null;
  phone_wa: string | null;
  telegram_chat_id: string | null;
  currency: 'SAR' | 'USD' | 'AED' | 'KWD';
  locale: 'ar' | 'en';
  theme: 'light' | 'dark';
  created_at: string;
}

export interface Worker {
  id: string;
  partner_id: string;
  full_name: string;
  username: string;
  phone: string | null;
  is_active: boolean;
  is_frozen: boolean;
  created_at: string;
}

export interface EquipmentType {
  id: string;
  partner_id: string;
  name: string;
  name_en: string | null;
}

export interface Equipment {
  id: string;
  partner_id: string;
  equipment_type_id: string;
  assigned_worker_id: string | null;
  plate_number: string | null;
  model: string | null;
  manufacture_year: number | null;
  is_active: boolean;
  equipment_type?: EquipmentType;
  assigned_worker?: Worker;
}

export interface WorkerContract {
  id: string;
  partner_id: string;
  worker_id: string;
  profit_percentage: number;
  effective_from: string;
  effective_to: string | null;
}

export type CycleStatus = 'open' | 'settled';

export interface FinancialCycle {
  id: string;
  partner_id: string;
  worker_id: string;
  equipment_id: string | null;
  title: string | null;
  status: CycleStatus;
  started_at: string;
  settled_at: string | null;
  total_income: number;
  total_expenses: number;
  net_amount: number;
  partner_share: number;
  worker_share: number;
  worker_transfers: number;
  partner_transfers: number;
  worker_net: number;
  partner_net: number;
  currency: string;
  report_url?: string | null;
  worker?: Worker;
  equipment?: Equipment;
}

export type TransactionType =
  | 'income'
  | 'expense'
  | 'transfer_to_partner'
  | 'transfer_to_worker'
  | 'driver_to_partner_transfer';

export interface Transaction {
  id: string;
  cycle_id: string;
  partner_id: string;
  worker_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  recorded_by: 'partner' | 'worker';
  customer_id?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  partner_id: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export interface SettlementResult {
  cycle_id: string;
  total_income: number;
  total_expenses: number;
  net_amount: number;
  worker_percentage: number;
  partner_percentage: number;
  worker_share: number;
  partner_share: number;
  worker_transfers: number;
  partner_transfers: number;
  worker_net: number;
  partner_net: number;
  currency: string;
}