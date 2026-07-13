'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddTransactionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddTransactionSheet({
  isOpen,
  onClose,
  onSubmit,
}: AddTransactionSheetProps) {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        date,
        notes,
      });
      // Reset form
      setType('income');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-lg transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1A1A1A]">أضف معاملة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-xs font-bold text-[#FFCD11] uppercase tracking-wider mb-3">
              نوع المعاملة
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'income', label: 'دخل', icon: '↑' },
                { value: 'expense', label: 'مصروف', icon: '↓' },
                { value: 'transfer', label: 'تحويل', icon: '→' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-sm ${
                    type === option.value
                      ? 'bg-[#FFCD11] text-[#1A1A1A] shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg mb-1 block">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-[#FFCD11] uppercase tracking-wider mb-3">
              المبلغ (بالريال)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none text-lg font-bold text-center transition-all duration-200"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-[#FFCD11] uppercase tracking-wider mb-3">
              التاريخ
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#FFCD11] uppercase tracking-wider mb-3">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف ملاحظات عن هذه المعاملة..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none resize-none transition-all duration-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!amount || isSubmitting}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-[#1A1A1A] transition-all duration-200 ${
                isSubmitting || !amount
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#FFCD11] hover:shadow-lg active:scale-95'
              }`}
            >
              {isSubmitting ? 'جاري الحفظ...' : '💾 حفظ المعاملة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
