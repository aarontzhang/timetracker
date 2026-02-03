import { useEffect, useRef, useState, useCallback } from 'react';
import TimeBlock from './TimeBlock';

function DayView({ dayData, onBlockClick, isToday, currentDate, categoryFrequencies, notificationSelectionMode, excludedHours = [], onToggleHourExclusion }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

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
      const scrollPosition = Math.max(0, (hour - 2) * blockHeight);
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [isToday]);

  // Determine if viewing a past day
  const isPastDay = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const viewDate = new Date(currentDate);
    viewDate.setHours(0, 0, 0, 0);
    return viewDate < today;
  }, [currentDate]);

  // Check if an hour is in the past (can be edited)
  const isHourPast = useCallback((hour) => {
    if (isPastDay()) return true;
    if (isToday) {
      return hour <= currentTime.getHours();
    }
    return false;
  }, [isPastDay, isToday, currentTime]);

  const getCurrentTimePosition = () => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hour * blockHeight) + (minutes / 60 * blockHeight);
  };

  const timePosition = getCurrentTimePosition();

  return (
    <div
      className={`day-view ${notificationSelectionMode ? 'selection-active' : ''}`}
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
          isPast={isHourPast(hour)}
        />
      ))}
    </div>
  );
}

export default DayView;
