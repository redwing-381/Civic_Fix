'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useMobile } from '@/hooks/use-mobile';
import DamageAnalyzer from '@/components/DamageAnalyzer';

export default function NewReport() {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">New Damage Report</h1>
              <p className="text-gray-500">Upload a photo of the damage and provide location details for analysis</p>
            </div>

            <DamageAnalyzer />
          </div>
        </main>
      </div>
    </div>
  );
} 