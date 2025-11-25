import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Page, AppMode } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
}

export function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  currentMode,
  onSwitchMode
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate} 
        currentMode={currentMode}
        onSwitchMode={onSwitchMode}
      />
      <main className="flex-1 lg:ml-0 min-w-0 overflow-y-auto">
        <div className="container mx-auto p-4 lg:p-8 max-w-7xl pt-16 lg:pt-8">
          {children}
          <div className="fixed bottom-2 right-2 text-xs text-muted-foreground opacity-50 pointer-events-none">
            v1.0.2
          </div>
        </div>
      </main>
    </div>
  );
}
