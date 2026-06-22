import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from '../components/nav/TopNav';
import { Sidebar } from '../components/nav/Sidebar';
import { SpotlightCommandBar } from '../components/spotlight/SpotlightCommandBar';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-bg-canvas overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
      {/* Global Spotlight (Cmd+K) */}
      <SpotlightCommandBar />
    </div>
  );
};
