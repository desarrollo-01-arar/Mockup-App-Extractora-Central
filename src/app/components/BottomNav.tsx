import { CalendarDays, List, RefreshCw, UserCircle } from 'lucide-react';
import { useApp, Screen } from '../context/AppContext';
import { syncItems } from '../data/mockData';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  screen: Screen;
  badge?: number;
}

const pendingSync = syncItems.filter(s => s.syncStatus === 'pending' || s.syncStatus === 'error').length;

export function BottomNav() {
  const { screen, navigate, isDark } = useApp();

  const items: NavItem[] = [
    {
      label: 'Inicio',
      icon: <CalendarDays size={22} />,
      screen: 'home',
    },
    {
      label: 'Sincronizar',
      icon: <RefreshCw size={22} />,
      screen: 'sync',
      badge: pendingSync > 0 ? pendingSync : undefined,
    },
    {
      label: 'Perfil',
      icon: <UserCircle size={22} />,
      screen: 'settings',
    },
  ];

  return (
    <div className="flex items-start h-16 bg-card shadow-[0px_-1px_10px_-5px_rgba(0,0,0,0.2)]">
      {items.map(item => {
        const isActive = screen === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => navigate(item.screen)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative ${isActive ? 'border-t-4 border-primary pt-1' : 'pt-2'}`}
          >
            {item.badge !== undefined && (
              <div className={`absolute ${isActive ? 'top-1' : 'top-2'} right-8 flex items-center justify-center rounded-full text-white bg-destructive w-4 h-4 text-[9px] font-bold`}>
                {item.badge}
              </div>
            )}
            <div className={isActive ? 'text-foreground' : 'text-muted-foreground'}>{item.icon}</div>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
