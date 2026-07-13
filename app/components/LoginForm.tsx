'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from './ButtonComponent';

interface LoginFormProps {
  title: string;
  subtitle?: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  logoContent?: React.ReactNode;
}

export function LoginForm({
  title,
  subtitle,
  onSubmit,
  isLoading = false,
  logoContent,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm md:max-w-md">
        {/* Logo Section */}
        {logoContent && (
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#FFCD11] flex items-center justify-center text-3xl md:text-4xl shadow-lg">
              {logoContent}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-semibold text-red-600">❌ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#FFCD11] uppercase tracking-wider mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#FFCD11] uppercase tracking-wider mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFCD11] focus:ring-2 focus:ring-[#FFCD11]/20 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#FFCD11] focus:ring-[#FFCD11]"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                تذكرني
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={submitting || isLoading}
              className="mt-6"
            >
              دخول
            </Button>
          </form>

          {/* Links */}
          <div className="space-y-2 text-center">
            <a
              href="/forgot-password"
              className="block text-sm text-[#FFCD11] hover:underline transition-colors"
            >
              هل نسيت كلمة المرور؟
            </a>
            <div className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <a
                href="/signup"
                className="text-[#FFCD11] font-semibold hover:underline transition-colors"
              >
                أنشئ واحداً الآن
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-600">
          <a href="/privacy" className="hover:text-gray-900 transition-colors">
            السياسة
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-gray-900 transition-colors">
            الشروط
          </a>
          <span>•</span>
          <a href="/support" className="hover:text-gray-900 transition-colors">
            الدعم
          </a>
        </div>
      </div>
    </div>
  );
}
