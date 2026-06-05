import { createContext, useContext, useState } from 'react';

export type Screen = 'login' | 'home' | 'visit' | 'sync' | 'settings';

interface AppContextType {
  screen: Screen;
  visitId: string | null;
  isDark: boolean;
  navigate: (screen: Screen, params?: { visitId?: string }) => void;
  toggleTheme: () => void;
  setIsDark: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>('login');
  const [visitId, setVisitId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const navigate = (s: Screen, params?: { visitId?: string }) => {
    setScreen(s);
    if (params?.visitId !== undefined) setVisitId(params.visitId);
  };

  const toggleTheme = () => setIsDark(d => !d);

  return (
    <AppContext.Provider value={{ screen, visitId, isDark, navigate, toggleTheme, setIsDark }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
