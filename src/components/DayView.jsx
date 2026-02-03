import { useEffect, useRef, useState, useCallback } from 'react';
import TimeBlock from './TimeBlock';

function DayView({ dayData, onBlockClick, isToday, categoryFrequencies }) {
  // All 24 hours of the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
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

  // Get the range of selected hours during drag
  const getSelectedRange = useCallback(() => {
    if (dragStart === null) return [];
    const end = dragEnd !== null ? dragEnd : dragStart;
    const min = Math.min(dragStart, end);
    const max = Math.max(dragStart, end);
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [dragStart, dragEnd]);

  const selectedRange = getSelectedRange();

  // Handle drag start
  const handlePointerDown = (hour) => {
    setIsDragging(true);
    setDragStart(hour);
    setDragEnd(hour);
  };

  // Handle drag move
  const handlePointerEnter = (hour) => {
    if (isDragging) {
      setDragEnd(hour);
    }
  };

  // Handle global pointer up to complete selection
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (!isDragging || dragStart === null) return;

      const end = dragEnd !== null ? dragEnd : dragStart;
      const min = Math.min(dragStart, end);
      const max = Math.max(dragStart, end);
      const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

      if (range.length === 1) {
        onBlockClick(range[0]);
      } else if (range.length > 1) {
        onBlockClick(range);
      }

      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, [isDragging, dragStart, dragEnd, onBlockClick]);

  return (
    <div
      className="day-view"
      ref={containerRef}
      style={{ touchAction: 'none' }}
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
          isSelected={selectedRange.includes(hour)}
          onPointerDown={() => handlePointerDown(hour)}
          onPointerEnter={() => handlePointerEnter(hour)}
          categoryFrequencies={categoryFrequencies}
        />
      ))}
    </div>
  );
}

export default DayView;
