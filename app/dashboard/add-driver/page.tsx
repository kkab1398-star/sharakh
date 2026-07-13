'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AddDriverPage() {
  const [step, setStep] = useState('info');

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Add New Driver</h1>

        <div className="bg-[#2A2A2A] rounded-lg p-8 mb-8 border border-[#3D3D3D]">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-white">Step 1 of 4</span>
              <span className="text-[#8B92A1]">Driver Information</span>
            </div>
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#FFCD11] w-1/4"></div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-white mb-6">Driver Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#FFCD11] font-bold uppercase mb-2">First Name</label>
              <input
                type="text"
                placeholder="e.g., Ahmed"
                className="w-full h-12 bg-[#1A1A1A] border border-[#3D3D3D] rounded text-white px-4"
              />
            </div>
            <div>
              <label className="block text-xs text-[#FFCD11] font-bold uppercase mb-2">Last Name</label>
              <input
                type="text"
                placeholder="e.g., Al-Mansouri"
                className="w-full h-12 bg-[#1A1A1A] border border-[#3D3D3D] rounded text-white px-4"
              />
            </div>
            <div>
              <label className="block text-xs text-[#FFCD11] font-bold uppercase mb-2">National ID</label>
              <input
                type="text"
                placeholder="e.g., 1234567890"
                className="w-full h-12 bg-[#1A1A1A] border border-[#3D3D3D] rounded text-white px-4"
              />
            </div>
            <div>
              <label className="block text-xs text-[#FFCD11] font-bold uppercase mb-2">License Number</label>
              <input
                type="text"
                placeholder="e.g., DLN-2024-001"
                className="w-full h-12 bg-[#1A1A1A] border border-[#3D3D3D] rounded text-white px-4"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-between mt-8">
            <button className="px-6 py-3 bg-[#2A2A2A] border border-[#FFCD11] text-[#FFCD11] rounded font-bold">
              ? Back
            </button>
            <button className="px-6 py-3 bg-[#FFCD11] text-[#1A1A1A] rounded font-bold">
              Next ?
            </button>
          </div>
        </div>

        <div className="bg-[#1E2A3A] rounded-lg p-6 border border-[#2A3A4A]">
          <p className="text-sm text-[#B8BEC3]">
            ? <span className="font-bold">Need Help?</span><br/>
            Contact support at <a href="mailto:support@sharakh.com" className="text-[#FFCD11]">support@sharakh.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
