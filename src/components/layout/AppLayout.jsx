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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-12 sm:pb-16">
      {/* Sidebar for Desktop & Mobile Slide-out */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAiModal={() => setIsAiDrawerOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar (< 768px) */}
      <MobileBottomNav onOpenAi={() => setIsAiDrawerOpen(true)} />

      {/* Floating Bhumitra AI Button on desktop/tablets */}
      <div className="hidden md:block">
        <BhumitraFloatingButton onClick={() => setIsAiDrawerOpen(true)} />
      </div>

      {/* Responsive Slide-out Bhumitra AI Chat Drawer */}
      <BhumitraAiDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      {/* Global 1-Click Multi-Role Persona Demo Switcher */}
      <DemoRoleBar />
    </div>
  );
};
