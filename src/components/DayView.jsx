import { useEffect, useRef, useState, useCallback } from 'react';
import TimeBlock from './TimeBlock';

function DayView({ dayData, onBlockClick, isToday, categoryFrequencies, notificationSelectionMode, excludedHours = [], onToggleHourExclusion, onFinishQuietHoursEdit }) {
  // All 24 hours of the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Quiet hours selection state
  const [quietDragStart, setQuietDragStart] = useState(null);
  const [quietDragEnd, setQuietDragEnd] = useState(null);
  const [isQuietDragging, setIsQuietDragging] = useState(false);
  const [quietDragAction, setQuietDragAction] = useState(null); // 'add' or 'remove'

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

  // Get the range of quiet hours during drag
  const getQuietSelectedRange = useCallback(() => {
    if (quietDragStart === null) return [];
    const end = quietDragEnd !== null ? quietDragEnd : quietDragStart;
    const min = Math.min(quietDragStart, end);
    const max = Math.max(quietDragStart, end);
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [quietDragStart, quietDragEnd]);

  const quietSelectedRange = getQuietSelectedRange();

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

  // Handle quiet hours drag start
  const handleQuietPointerDown = (hour) => {
    setIsQuietDragging(true);
    setQuietDragStart(hour);
    setQuietDragEnd(hour);
    // Determine action based on whether first hour is excluded
    setQuietDragAction(excludedHours.includes(hour) ? 'remove' : 'add');
  };

  // Handle quiet hours drag move
  const handleQuietPointerEnter = (hour) => {
    if (isQuietDragging) {
      setQuietDragEnd(hour);
    }
  };

  // Handle global pointer up to complete selection
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      // Handle regular activity selection
      if (isDragging && dragStart !== null) {
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
      }

      // Handle quiet hours selection
      if (isQuietDragging && quietDragStart !== null) {
        const end = quietDragEnd !== null ? quietDragEnd : quietDragStart;
        const min = Math.min(quietDragStart, end);
        const max = Math.max(quietDragStart, end);
        const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        // Toggle all hours in range based on initial action
        range.forEach(hour => {
          const isCurrentlyExcluded = excludedHours.includes(hour);
          if (quietDragAction === 'add' && !isCurrentlyExcluded) {
            onToggleHourExclusion(hour);
          } else if (quietDragAction === 'remove' && isCurrentlyExcluded) {
            onToggleHourExclusion(hour);
          }
        });

        setIsQuietDragging(false);
        setQuietDragStart(null);
        setQuietDragEnd(null);
        setQuietDragAction(null);
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, [isDragging, dragStart, dragEnd, onBlockClick, isQuietDragging, quietDragStart, quietDragEnd, quietDragAction, excludedHours, onToggleHourExclusion]);

  // Determine if an hour should show as "pending" during quiet drag
  const isQuietPending = (hour) => {
    if (!isQuietDragging) return false;
    const inRange = quietSelectedRange.includes(hour);
    if (!inRange) return false;

    const isCurrentlyExcluded = excludedHours.includes(hour);
    if (quietDragAction === 'add') {
      return !isCurrentlyExcluded; // Will be added
    } else {
      return isCurrentlyExcluded; // Will be removed
    }
  };

  return (
    <div
      className="day-view"
      ref={containerRef}
      style={{ touchAction: 'none' }}
    >
      {notificationSelectionMode && (
        <div className="selection-mode-banner">
          <span>Drag to select quiet hours</span>
          <button className="done-editing-btn" onClick={onFinishQuietHoursEdit}>
            Done
          </button>
        </div>
      )}
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
          onPointerDown={() => {
            if (notificationSelectionMode) {
              handleQuietPointerDown(hour);
            } else {
              handlePointerDown(hour);
            }
          }}
          onPointerEnter={() => {
            if (notificationSelectionMode) {
              handleQuietPointerEnter(hour);
            } else {
              handlePointerEnter(hour);
            }
          }}
          categoryFrequencies={categoryFrequencies}
          isExcluded={excludedHours.includes(hour)}
          notificationSelectionMode={notificationSelectionMode}
          isQuietPending={isQuietPending(hour)}
          quietDragAction={quietDragAction}
        />
      ))}
    </div>
  );
}

export default DayView;
