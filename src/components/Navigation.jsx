function Navigation({ date, onPrev, onNext, onToday, view, onViewChange }) {
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

  return (
    <header className="navigation">
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
