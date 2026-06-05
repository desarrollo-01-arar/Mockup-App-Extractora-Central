import { Signal, Wifi, Battery } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  const { isDark } = useApp();

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-[#0f172a]">
      <div
        className={`relative flex-shrink-0 overflow-hidden bg-background ${isDark ? 'dark' : ''}`}
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          boxShadow: '0 0 0 2px #2a2a2a, 0 0 0 5px #1a1a1a, 0 0 0 6px #333, 0 40px 100px rgba(0,0,0,0.8)',
        }}
      >
        {/* Phone side buttons (decorative) */}
        <div className="absolute -left-[3px] top-28 w-[3px] h-10 rounded-l-sm bg-neutral-900" />
        <div className="absolute -left-[3px] top-44 w-[3px] h-14 rounded-l-sm bg-neutral-900" />
        <div className="absolute -left-[3px] top-60 w-[3px] h-14 rounded-l-sm bg-neutral-900" />
        <div className="absolute -right-[3px] top-36 w-[3px] h-20 rounded-r-sm bg-neutral-900" />

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 46 }}>
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center px-8 h-11 bg-primary">
            <span className="text-white text-xs font-semibold" style={{ letterSpacing: '0.02em' }}>9:41</span>
            <div className="flex-1" />
            <div className="flex items-center gap-[5px] text-white">
              <Signal size={12} strokeWidth={2.5} />
              <Wifi size={12} strokeWidth={2.5} />
              <Battery size={14} strokeWidth={2.5} />
            </div>
          </div>

          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 z-50 -translate-x-1/2 bg-black"
            style={{
              width: 126,
              height: 34,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          />

          {/* Main content area */}
          <div className="absolute left-0 right-0 bottom-0" style={{ top: 44 }}>
            {children}
          </div>

          {/* Home indicator */}
          <div
            className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2 rounded-full bg-muted-foreground/50"
            style={{ width: 130, height: 5 }}
          />
        </div>
      </div>
    </div>
  );
}
