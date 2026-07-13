'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#10B981] bg-opacity-10 border-2 border-[#10B981] mb-6 mx-auto">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Driver Added!</h1>
          <p className="text-[#B8BEC3] mb-4">
            The driver has been successfully added to your team
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📧</span>
              <div className="flex-1">
                <p className="text-xs text-[#8B92A1] font-semibold">ACTIVATION EMAIL</p>
                <p className="text-sm text-white mt-1">
                  An activation email has been sent to the driver's email address. They can log in once they confirm their email.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#2A3A4A]" />

            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🔐</span>
              <div className="flex-1">
                <p className="text-xs text-[#8B92A1] font-semibold">SECURITY</p>
                <p className="text-sm text-white mt-1">
                  Driver needs to set their password when they confirm their email for the first time.
                </p>
              </div>
            </div>

            <div className="h-px bg-[#2A3A4A]" />

            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⏱️</span>
              <div className="flex-1">
                <p className="text-xs text-[#8B92A1] font-semibold">NEXT STEPS</p>
                <p className="text-sm text-white mt-1">
                  The driver can start using the platform immediately after confirming their email.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            asChild
          >
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>

          <Button
            variant="secondary"
            fullWidth
            asChild
          >
            <Link href="/dashboard/add-driver">➕ Add Another Driver</Link>
          </Button>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#8B92A1]">
            Need help?{' '}
            <a
              href="mailto:support@sharakh.com"
              className="text-[#FFCD11] hover:underline font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
