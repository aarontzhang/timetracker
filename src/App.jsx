import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import DayView from './components/DayView';
import StatsView from './components/StatsView';
import ActivityModal from './components/ActivityModal';
import { useStorage } from './hooks/useStorage';
import { useNotifications } from './hooks/useNotifications';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('day');
  const [selectedHour, setSelectedHour] = useState(null);
  const { data, getDay, setActivity, clearActivity } = useStorage();
  const notifications = useNotifications();

  // Calculate how often each category is used across all data
  const categoryFrequencies = useMemo(() => {
    const frequencies = {};
    Object.values(data).forEach(dayData => {
      Object.values(dayData).forEach(activity => {
        if (!activity) return;
        const cats = activity.categories || (activity.category ? [activity.category] : []);
        cats.forEach(catId => {
          frequencies[catId] = (frequencies[catId] || 0) + 1;
        });
      });
    });
    return frequencies;
  }, [data]);

  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const dayData = getDay(dateStr);

  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  const handlePrev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBlockClick = (hours) => {
    // hours can be a single hour or an array of hours
    setSelectedHour(hours);
  };

  const handleSave = (activity) => {
    const hours = Array.isArray(selectedHour) ? selectedHour : [selectedHour];
    hours.forEach(hour => {
      setActivity(dateStr, hour, activity);
    });
    setSelectedHour(null);
  };

  const handleClear = () => {
    const hours = Array.isArray(selectedHour) ? selectedHour : [selectedHour];
    hours.forEach(hour => {
      clearActivity(dateStr, hour);
    });
    setSelectedHour(null);
  };

  return (
    <div className="app">
      <Navigation
        date={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        view={view}
        onViewChange={setView}
        notifications={notifications}
      />

      <main className="main-content">
        {view === 'day' ? (
          <DayView
            dayData={dayData}
            onBlockClick={handleBlockClick}
            isToday={isToday()}
            categoryFrequencies={categoryFrequencies}
            notificationSelectionMode={notifications.selectionMode}
            excludedHours={notifications.excludedHours}
            onToggleHourExclusion={notifications.toggleHourExclusion}
          />
        ) : (
          <StatsView data={data} currentDate={currentDate} />
        )}
      </main>

      {selectedHour !== null && (
        <ActivityModal
          hour={selectedHour}
          activity={dayData[selectedHour]}
          onSave={handleSave}
          onClear={handleClear}
          onClose={() => setSelectedHour(null)}
        />
      )}

      {notifications.selectionMode && (
        <div className="floating-done-bar">
          <span className="floating-done-label">Tap hours to exclude from reminders</span>
          <button
            className="floating-done-btn"
            onClick={() => notifications.toggleSelectionMode()}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
