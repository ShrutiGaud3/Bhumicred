import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../common/Header.jsx';
import { Footer } from '../common/Footer.jsx';
import { BhumitraAiDrawer } from '../../features/ai/components/BhumitraAiDrawer.jsx';

export const PublicLayout = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onToggleSidebar={() => {}} onOpenAiModal={() => setIsAiOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BhumitraAiDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
};
