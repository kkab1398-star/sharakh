'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, HeaderCard } from '@/components/ui/Card';

type Step = 'info' | 'contact' | 'bank' | 'review';

export default function AddDriverPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    licenseNumber: '',
    email: '',
    phone: '',
    bankName: '',
    accountNumber: '',
    iban: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'info') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.nationalId) newErrors.nationalId = 'National ID is required';
      if (!formData.licenseNumber)
        newErrors.licenseNumber = 'License number is required';
    } else if (step === 'contact') {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    } else if (step === 'bank') {
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
      if (!formData.iban) newErrors.iban = 'IBAN is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    const steps: Step[] = ['info', 'contact', 'bank', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const steps: Step[] = ['info', 'contact', 'bank', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/dashboard/add-driver/success');
    } catch (err) {
      console.error('Error adding driver:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = {
    info: "Driver Information",
    contact: "Contact Details",
    bank: "Bank Information",
    review: "Review & Confirm",
  };

  const stepDescriptions = {
    info: "Enter the driver's personal details",
    contact: "Add contact information",
    bank: "Enter bank account details",
    review: "Review all information before submission",
  };

  const currentStepIndex = ['info', 'contact', 'bank', 'review'].indexOf(step);

  return (
    <MainLayout>
      {/* Header */}
      <HeaderCard
        title="Add New Driver"
        description="Complete all steps to add a new driver to your team"
      />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">
            Step {currentStepIndex + 1} of 4
          </span>
          <span className="text-sm text-[#8B92A1]">{stepTitles[step]}</span>
        </div>
        <div className="h-2 bg-[#1E2A3A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFCD11] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl mx-auto mb-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-1">
            {stepTitles[step]}
          </h3>
          <p className="text-sm text-[#8B92A1]">{stepDescriptions[step]}</p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Step 1: Basic Info */}
          {step === 'info' && (
            <>
              <Input
                label="First Name"
                placeholder="e.g., Ahmed"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                placeholder="e.g., Al-Mansouri"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
              />
              <Input
                label="National ID"
                placeholder="e.g., 1234567890"
                value={formData.nationalId}
                onChange={(e) =>
                  handleInputChange('nationalId', e.target.value)
                }
                error={errors.nationalId}
              />
              <Input
                label="License Number"
                placeholder="e.g., DLN-2024-001"
                value={formData.licenseNumber}
                onChange={(e) =>
                  handleInputChange('licenseNumber', e.target.value)
                }
                error={errors.licenseNumber}
              />
            </>
          )}

          {/* Step 2: Contact */}
          {step === 'contact' && (
            <>
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g., ahmed@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g., +966 50 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
              />
              <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                <p className="text-xs text-[#8B92A1]">
                  ✓ An activation email will be sent to this address after
                  confirmation
                </p>
              </div>
            </>
          )}

          {/* Step 3: Bank Info */}
          {step === 'bank' && (
            <>
              <Input
                label="Bank Name"
                placeholder="e.g., Saudi National Bank"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                error={errors.bankName}
              />
              <Input
                label="Account Number"
                placeholder="e.g., 123456789"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange('accountNumber', e.target.value)
                }
              />
              <Input
                label="IBAN"
                placeholder="e.g., SA44 2000 0001 2345 6789 0123"
                value={formData.iban}
                onChange={(e) => handleInputChange('iban', e.target.value)}
                error={errors.iban}
              />
            </>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <p className="text-xs text-[#8B92A1] mb-1">FULL NAME</p>
                  <p className="text-sm font-semibold text-white">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <p className="text-xs text-[#8B92A1] mb-1">NATIONAL ID</p>
                  <p className="text-sm font-semibold text-white">
                    {formData.nationalId}
                  </p>
                </div>
                <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <p className="text-xs text-[#8B92A1] mb-1">EMAIL</p>
                  <p className="text-sm font-semibold text-white">
                    {formData.email}
                  </p>
                </div>
                <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <p className="text-xs text-[#8B92A1] mb-1">PHONE</p>
                  <p className="text-sm font-semibold text-white">
                    {formData.phone}
                  </p>
                </div>
                <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <p className="text-xs text-[#8B92A1] mb-1">BANK</p>
                  <p className="text-sm font-semibold text-white">
                    {formData.bankName}
                  </p>
                </div>
                <div className="p-4 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <p className="text-xs text-[#8B92A1] mb-1">IBAN</p>
                  <p className="text-sm font-semibold text-white text-truncate">
                    {formData.iban}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FFCD11]/10 rounded-lg border border-[#FFCD11]/20">
                <p className="text-xs text-[#FFCD11]">
                  ✓ Please review all information. You can go back to edit if
                  needed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={step === 'info'}
          >
            ← Back
          </Button>

          {step === 'review' ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              ✓ Confirm & Add Driver
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Next →
            </Button>
          )}
        </div>
      </Card>

      {/* Help Section */}
      <Card className="max-w-2xl mx-auto bg-[#1E2A3A]/50 border-[#2A3A4A]">
        <div className="flex gap-3">
          <div className="text-lg flex-shrink-0">❓</div>
          <div className="text-sm text-[#B8BEC3]">
            <p className="font-semibold text-white mb-1">Need Help?</p>
            <p>
              Contact support at{' '}
              <a
                href="mailto:support@sharakh.com"
                className="text-[#FFCD11] hover:underline"
              >
                support@sharakh.com
              </a>
            </p>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
}
