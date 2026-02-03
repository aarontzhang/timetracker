import { useEffect, useRef, useState } from 'react';
import TimeBlock from './TimeBlock';

function DayView({ dayData, onBlockClick, isToday, categoryFrequencies, notificationSelectionMode, excludedHours = [], onToggleHourExclusion }) {
  // All 24 hours of the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Block height: 54px with no margin
  const blockHeight = 54;

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to current time on mount (only for today)
  useEffect(() => {
    if (isToday && containerRef.current) {
      const hour = new Date().getHours();
      // Scroll to 2 hours before current time, centered in view
      const scrollPosition = Math.max(0, (hour - 2) * blockHeight);
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [isToday]);

  // Calculate position for current time indicator
  const getCurrentTimePosition = () => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();

    return (hour * blockHeight) + (minutes / 60 * blockHeight);
  };

  const timePosition = getCurrentTimePosition();

  return (
    <div
      className="day-view"
      ref={containerRef}
    >
      {isToday && (
        <div
          className="time-indicator"
          style={{ top: `${timePosition + 8}px` }}
        >
          <div className="time-indicator-dot"></div>
          <div className="time-indicator-line"></div>
        </div>
      )}
      {hours.map(hour => (
        <TimeBlock
          key={hour}
          hour={hour}
          activity={dayData[hour]}
          onEdit={onBlockClick}
          onToggleQuiet={onToggleHourExclusion}
          categoryFrequencies={categoryFrequencies}
          isExcluded={excludedHours.includes(hour)}
          notificationSelectionMode={notificationSelectionMode}
        />
      ))}
    </div>
  );
}

export default DayView;
