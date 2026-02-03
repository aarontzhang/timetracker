import { useState } from 'react';
import { useStorage } from './hooks/useStorage';
import { useNotifications } from './hooks/useNotifications';
import { HomeScreen } from './components/HomeScreen';
import { InsightsScreen } from './components/InsightsScreen';

type Screen = 'home' | 'insights';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const { logs, categories, settings, addLog, getCheckInStatus } = useStorage();
  const checkInStatus = getCheckInStatus();

  // Schedule notifications based on settings
  useNotifications(settings);

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>

      {screen === 'home' && (
        <HomeScreen
          categories={categories}
          settings={settings}
          checkInStatus={checkInStatus}
          onLog={addLog}
          onNavigate={setScreen}
        />
      )}
      {screen === 'insights' && (
        <InsightsScreen
          logs={logs}
          categories={categories}
          onBack={() => setScreen('home')}
        />
      )}
    </>
  );
}

export default App;
