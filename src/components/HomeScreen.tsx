import { useState, useEffect } from 'react';
import { CategoryButton } from './CategoryButton';
import type { Category, Settings } from '../types';

interface HomeScreenProps {
  categories: Category[];
  settings: Settings;
  checkInStatus: {
    isDue: boolean;
    nextCheckInAt: number | null;
    timeUntilNext: number;
  };
  onLog: (category: string) => void;
  onNavigate: (screen: 'insights') => void;
}

export function HomeScreen({ categories, settings, checkInStatus, onLog, onNavigate }: HomeScreenProps) {
  const [customInput, setCustomInput] = useState('');
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(checkInStatus.timeUntilNext);

  // Update countdown timer
  useEffect(() => {
    if (checkInStatus.isDue) return;

    setTimeLeft(checkInStatus.timeUntilNext);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(interval);
          window.location.reload(); // Refresh to show check-in
        }
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [checkInStatus.isDue, checkInStatus.timeUntilNext]);

  const handleLog = (category: string) => {
    onLog(category);
    setShowConfirmation(category);
    setCustomInput('');
    setTimeout(() => {
      setShowConfirmation(null);
    }, 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleLog(customInput.trim());
    }
  };

  const formatTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatTime12h = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (b.useCount !== a.useCount) return b.useCount - a.useCount;
    return b.lastUsed - a.lastUsed;
  });

  // Confirmation screen after logging
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-lg text-gray-600">Logged <span className="font-medium text-gray-800">{showConfirmation}</span></p>
        </div>
      </div>
    );
  }

  // Waiting screen - no check-in due
  if (!checkInStatus.isDue) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-6 py-8 flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <div className="w-10" />
          <h1 className="text-lg font-semibold text-gray-800">TimeTrack</h1>
          <div className="w-10" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">Next check-in in</p>
            <p className="text-4xl font-semibold text-gray-800 mb-4 tabular-nums">
              {formatTimeLeft(timeLeft)}
            </p>
            <p className="text-gray-400 text-sm">
              We'll notify you when it's time
            </p>
          </div>
        </div>

        {/* Excluded hours info */}
        <div className="text-center mb-4">
          <p className="text-xs text-gray-400">
            Quiet hours: {formatTime12h(settings.sleepStart)} – {formatTime12h(settings.sleepEnd)}
          </p>
        </div>

        <footer className="flex justify-center">
          <button
            onClick={() => onNavigate('insights')}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Insights
          </button>
        </footer>
      </div>
    );
  }

  // Check-in screen - time to log
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-8 flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div className="w-10" />
        <h1 className="text-lg font-semibold text-gray-800">TimeTrack</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          What did you do?
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Last {settings.intervalHours} hour{settings.intervalHours > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {sortedCategories.slice(0, 6).map(cat => (
            <CategoryButton
              key={cat.name}
              name={cat.name}
              color={cat.color}
              onClick={() => handleLog(cat.name)}
            />
          ))}
        </div>

        <form onSubmit={handleCustomSubmit} className="w-full">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Or type something..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </form>
      </div>

      {/* Excluded hours info */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-400">
          Quiet hours: {formatTime12h(settings.sleepStart)} – {formatTime12h(settings.sleepEnd)}
        </p>
      </div>

      <footer className="flex justify-center">
        <button
          onClick={() => onNavigate('insights')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Insights
        </button>
      </footer>
    </div>
  );
}
