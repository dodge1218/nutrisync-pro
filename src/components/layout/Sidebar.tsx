import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { 
  SquaresFour, 
  ForkKnife, 
  CalendarBlank, 
  Lightbulb, 
  Student, 
  Trophy, 
  Gear, 
  Moon, 
  Sun, 
  SignOut,
  List,
  X,
  Leaf
} from '@phosphor-icons/react';
import { Page, AppMode } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { SmartEntryDialog } from '@/components/SmartEntryDialog';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentMode: AppMode;
  onSwitchMode: (mode: AppMode) => void;
  className?: string;
}

export function Sidebar({ 
  currentPage, 
  onNavigate, 
  currentMode, 
  onSwitchMode,
  className 
}: SidebarProps) {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'food-budget', label: 'Dashboard', icon: SquaresFour, mode: 'nutriwell' },
    { id: 'log-food', label: 'Log Food', icon: ForkKnife, mode: 'nutriwell' },
    { id: 'meal-planner', label: 'Meal Planner', icon: CalendarBlank, mode: 'nutriwell' },
    { id: 'recommendations', label: 'Insights', icon: Lightbulb, mode: 'nutriwell' },
    { id: 'education', label: 'Learn', icon: Student, mode: 'nutriwell' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, mode: 'nutriwell' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page as Page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button & Theme Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center gap-2">
        <button 
          className="p-2 bg-card rounded-md shadow-md border border-border text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
        </button>
        <ModeToggle className="bg-card border border-border shadow-md rounded-md h-[42px] w-[42px]" />
      </div>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card text-card-foreground border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" weight="fill" />
              </div>
              <span className="font-bold text-xl tracking-tight">NutriWell</span>
            </div>
            <ModeToggle className="hidden lg:flex" />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            <div className="mb-6 px-1">
              <SmartEntryDialog />
            </div>

            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Nutrition
              </p>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start mb-1 font-medium",
                    currentPage === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                  onClick={() => {
                    onSwitchMode('nutriwell');
                    handleNavigate(item.id);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-3" weight={currentPage === item.id ? "duotone" : "regular"} />
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Wellness
              </p>
              <Button
                variant={currentMode === 'sleepsync' ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1 font-medium",
                  currentMode === 'sleepsync' && "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15"
                )}
                onClick={() => {
                  onSwitchMode('sleepsync');
                  handleNavigate('sleepsync'); 
                }}
              >
                <Moon className="w-4 h-4 mr-3" weight={currentMode === 'sleepsync' ? "duotone" : "regular"} />
                SleepSync
              </Button>
              <Button
                variant={currentMode === 'lifeflow' ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1 font-medium",
                  currentMode === 'lifeflow' && "bg-sky-500/10 text-sky-500 hover:bg-sky-500/15"
                )}
                onClick={() => {
                  onSwitchMode('lifeflow');
                  handleNavigate('lifeflow');
                }}
              >
                <Sun className="w-4 h-4 mr-3" weight={currentMode === 'lifeflow' ? "duotone" : "regular"} />
                LifeFlow
              </Button>
            </div>
          </div>

          {/* Footer / User */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant={currentPage === 'settings' ? "secondary" : "ghost"}
              className="w-full justify-start font-medium"
              onClick={() => handleNavigate('settings')}
            >
              <Gear className="w-4 h-4 mr-3" weight={currentPage === 'settings' ? "duotone" : "regular"} />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium"
              onClick={() => signOut()}
            >
              <SignOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
