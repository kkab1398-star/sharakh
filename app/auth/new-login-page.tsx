'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFCD11] text-[#1A1A1A] mb-4 mx-auto">
            <span className="text-3xl">🚜</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SHARAKH</h1>
          <p className="text-[#B8BEC3]">Partner Operations Platform</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-[#EF4444] bg-opacity-10 border border-[#EF4444] border-opacity-20">
              <p className="text-sm font-medium text-[#EF4444]">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              required
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[#B8BEC3] hover:text-white transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2A3A4A] bg-[#1A2A3A] text-[#FFCD11]"
                />
                Remember me
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[#FFCD11] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="h-12 text-base font-semibold"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[#2A3A4A]" />
            <span className="text-xs text-[#8B92A1] uppercase">Or</span>
            <div className="h-px flex-1 bg-[#2A3A4A]" />
          </div>

          {/* Social Login */}
          <Button
            variant="secondary"
            fullWidth
            leftIcon="👤"
            className="h-12"
          >
            Continue with Google
          </Button>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-[#B8BEC3] text-sm">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-[#FFCD11] font-semibold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[#8B92A1]">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
