import { useState, useRef, type TouchEvent } from 'react';
import type { LogEntry, Category } from '../types';

interface InsightsScreenProps {
  logs: LogEntry[];
  categories: Category[];
  onBack: () => void;
}

export function InsightsScreen({ logs, categories, onBack }: InsightsScreenProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  });

  // Swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextDay();
    } else if (isRightSwipe) {
      goToPreviousDay();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const goToPreviousDay = () => {
    setSelectedDate(prev => prev - 24 * 60 * 60 * 1000);
  };

  const goToNextDay = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today.getTime()) {
      setSelectedDate(prev => prev + 24 * 60 * 60 * 1000);
    }
  };

  const isToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today.getTime();
  };

  // Filter logs for selected day
  const dayStart = selectedDate;
  const dayEnd = selectedDate + 24 * 60 * 60 * 1000;
  const dayLogs = logs.filter(log => log.timestamp >= dayStart && log.timestamp < dayEnd);

  const categoryTotals = dayLogs.reduce((acc, log) => {
    const duration = log.periodEnd - log.periodStart;
    acc[log.category] = (acc[log.category] || 0) + duration;
    return acc;
  }, {} as Record<string, number>);

  const totalTime = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([name, time]) => ({
      name,
      time,
      percentage: totalTime > 0 ? Math.round((time / totalTime) * 100) : 0,
      color: categories.find(c => c.name === name)?.color || '#6b7280',
    }));

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (timestamp >= today.getTime()) {
      return 'Today';
    } else if (timestamp >= yesterday.getTime()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="min-h-screen bg-[#fafafa] px-6 py-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 -ml-2"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Insights</h1>
        <div className="w-10" />
      </header>

      {/* Day Navigation */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={goToPreviousDay}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center min-w-[140px]">
          <p className="text-lg font-semibold text-gray-800">{formatDate(selectedDate)}</p>
          <p className="text-xs text-gray-400">Swipe or tap arrows</p>
        </div>

        <button
          onClick={goToNextDay}
          disabled={isToday()}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isToday()
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-gray-100 active:bg-gray-200 text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {dayLogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-lg font-medium text-gray-800 mb-2">No data for this day</h2>
            <p className="text-gray-500 text-sm">
              No activities were logged on {formatDate(selectedDate).toLowerCase()}
            </p>
          </div>
        ) : (
          <>
            <section className="mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Total Tracked
                </h2>
                <p className="text-3xl font-semibold text-gray-800 mb-1">
                  {formatTime(totalTime)}
                </p>
                <p className="text-sm text-gray-500">
                  across {dayLogs.length} check-in{dayLogs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Time Breakdown
              </h2>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="h-3 flex">
                  {sortedCategories.map(cat => (
                    <div
                      key={cat.name}
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  ))}
                </div>
                <div className="p-4 space-y-3">
                  {sortedCategories.map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm text-gray-800">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-800">
                          {cat.percentage}%
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {formatTime(cat.time)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {sortedCategories.length > 0 && (
              <section>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h2 className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-2">
                    Top Activity
                  </h2>
                  <p className="text-xl font-semibold text-gray-800 mb-1">
                    {sortedCategories[0].name}
                  </p>
                  <p className="text-sm text-gray-600">
                    You spent {sortedCategories[0].percentage}% of your tracked time on this
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
