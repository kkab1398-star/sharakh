'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, HeaderCard } from '@/components/ui/Card';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  return (
    <MainLayout>
      <HeaderCard
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div>
          <Card className="sticky top-24">
            <div className="space-y-2">
              {[
                { label: 'General', icon: '⚙️' },
                { label: 'Notifications', icon: '🔔' },
                { label: 'Security', icon: '🔒' },
                { label: 'Billing', icon: '💳' },
                { label: 'Team', icon: '👥' },
                { label: 'API Keys', icon: '🔑' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#1E2A3A] text-sm font-semibold text-white transition-colors"
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">General Settings</h3>
            <div className="space-y-4 mb-6">
              <Input label="Company Name" placeholder="Your company name" value="Al-Mansouri Transport" />
              <Input label="Email Address" type="email" placeholder="Email" value="admin@sharakh.com" />
              <Input label="Phone Number" type="tel" placeholder="Phone" value="+966 50 123 4567" />
              <div>
                <label className="block text-xs text-[#8B92A1] font-semibold mb-2">COMPANY DESCRIPTION</label>
                <textarea
                  className="w-full h-24 p-3 rounded-lg bg-[#1E2A3A] border border-[#2A3A4A] text-white focus:border-[#FFCD11] outline-none"
                  placeholder="Describe your company..."
                  defaultValue="Leading transport and logistics provider in Saudi Arabia"
                />
              </div>
            </div>
            <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
              💾 Save Changes
            </Button>
          </Card>

          {/* Notification Settings */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {Object.entries(notificationPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-[#1E2A3A] rounded-lg border border-[#2A3A4A]">
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setNotificationPreferences((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 cursor-pointer accent-[#FFCD11]"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Security Settings */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Security</h3>
            <div className="space-y-3">
              <Button variant="secondary" fullWidth>
                🔐 Change Password
              </Button>
              <Button variant="secondary" fullWidth>
                🗝️ Two-Factor Authentication
              </Button>
              <Button variant="secondary" fullWidth>
                📝 Active Sessions
              </Button>
            </div>
          </Card>

          {/* Billing Settings */}
          <Card className="border-[#FFCD11]/30 bg-gradient-to-br from-[#FFCD11]/5 to-transparent">
            <h3 className="text-lg font-bold text-white mb-2">Billing & Subscription</h3>
            <p className="text-xs text-[#8B92A1] mb-4">Current plan: Professional (Annual)</p>
            <div className="space-y-3">
              <Button variant="primary" fullWidth>
                📊 View Invoice
              </Button>
              <Button variant="secondary" fullWidth>
                💳 Update Payment Method
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-[#EF4444]/30 bg-gradient-to-br from-[#EF4444]/5 to-transparent">
            <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
            <div className="space-y-2">
              <p className="text-xs text-[#8B92A1] mb-4">These actions cannot be undone. Please proceed with caution.</p>
              <Button variant="danger" fullWidth>
                🚪 Sign Out All Devices
              </Button>
              <Button variant="danger" fullWidth>
                🗑️ Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}