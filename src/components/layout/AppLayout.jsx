import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header.jsx';
import { Sidebar } from '../common/Sidebar.jsx';
import { MobileBottomNav } from '../common/MobileBottomNav.jsx';
import { BhumitraAiDrawer } from '../../features/ai/components/BhumitraAiDrawer.jsx';
import { BhumitraFloatingButton } from '../../features/ai/components/BhumitraFloatingButton.jsx';
import { DemoRoleBar } from './DemoRoleBar.jsx';

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-12 sm:pb-16 print:p-0 print:m-0 print:pb-0 print:bg-white print:block print:min-h-0">
      {/* Sidebar for Desktop & Mobile Slide-out */}
      <div className="print:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 print:p-0 print:m-0 print:w-full">
        <div className="print:hidden">
          <Header
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onOpenAiModal={() => setIsAiDrawerOpen(true)}
          />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto pb-24 md:pb-8 print:p-0 print:m-0 print:max-w-none print:w-full print:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar (< 768px) */}
      <div className="print:hidden">
        <MobileBottomNav onOpenAi={() => setIsAiDrawerOpen(true)} />
      </div>

      {/* Floating Bhumitra AI Button on desktop/tablets */}
      <div className="hidden md:block print:hidden">
        <BhumitraFloatingButton onClick={() => setIsAiDrawerOpen(true)} />
      </div>

      {/* Responsive Slide-out Bhumitra AI Chat Drawer */}
      <div className="print:hidden">
        <BhumitraAiDrawer
          isOpen={isAiDrawerOpen}
          onClose={() => setIsAiDrawerOpen(false)}
        />
      </div>

      {/* Global 1-Click Multi-Role Persona Demo Switcher */}
      <div className="print:hidden">
        <DemoRoleBar />
      </div>
    </div>
  );
};
