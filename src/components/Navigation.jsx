import { useState, useRef, useEffect } from 'react';

function Navigation({ date, onPrev, onNext, onToday, view, onViewChange, notifications }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const checkIsToday = () => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isToday = checkIsToday();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationToggle = () => {
    notifications.toggleEnabled();
  };

  const handleEditExclusions = () => {
    notifications.toggleSelectionMode();
    setSettingsOpen(false);
  };

  return (
    <header className="navigation">
      <div className="nav-row">
        <div className="date-nav">
          <button className="nav-btn" onClick={onPrev}>&lt;</button>
          <div className="date-display">
            <span className="current-date">{formatDate(date)}</span>
            <div className="today-container">
              {isToday ? (
                <span className="today-label">Today</span>
              ) : (
                <button className="today-btn" onClick={onToday}>Go to today</button>
              )}
            </div>
          </div>
          <button className="nav-btn" onClick={onNext}>&gt;</button>
        </div>

        <div className="settings-container" ref={settingsRef}>
          <button
            className={`settings-btn ${settingsOpen ? 'active' : ''}`}
            onClick={() => setSettingsOpen(!settingsOpen)}
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {settingsOpen && (
            <div className="settings-dropdown">
              <div className="settings-item">
                <span className="settings-label">Hourly reminders</span>
                <button
                  className={`settings-toggle ${notifications.enabled ? 'on' : ''}`}
                  onClick={handleNotificationToggle}
                >
                  {notifications.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
              {notifications.enabled && (
                <button
                  className="settings-action"
                  onClick={handleEditExclusions}
                >
                  {notifications.selectionMode ? 'Done editing' : 'Edit quiet hours'}
                </button>
              )}
              {notifications.excludedHours.length > 0 && (
                <div className="settings-info">
                  {notifications.excludedHours.length} hour{notifications.excludedHours.length !== 1 ? 's' : ''} excluded
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="view-toggle">
        <button
          className={`toggle-btn ${view === 'day' ? 'active' : ''}`}
          onClick={() => onViewChange('day')}
        >
          Day
        </button>
        <button
          className={`toggle-btn ${view === 'stats' ? 'active' : ''}`}
          onClick={() => onViewChange('stats')}
        >
          Stats
        </button>
      </div>
    </header>
  );
}

export default Navigation;
