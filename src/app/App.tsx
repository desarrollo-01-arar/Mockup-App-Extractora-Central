import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/screens/LoginScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { VisitFormScreen } from './components/screens/VisitFormScreen';
import { SyncScreen } from './components/screens/SyncScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

function AppContent() {
  const { screen } = useApp();

  const showBottomNav = screen !== 'login' && screen !== 'visit';

  return (
    <MobileFrame>
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0 overflow-hidden">
          {screen === 'login' && <LoginScreen />}
          {screen === 'home' && <CalendarScreen />}
          {screen === 'visit' && <VisitFormScreen />}
          {screen === 'sync' && <SyncScreen />}
          {screen === 'settings' && <SettingsScreen />}
        </div>
        {showBottomNav && <BottomNav />}
      </div>
    </MobileFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
