import { useState, useEffect, useRef, useCallback } from 'react';

const NOTIFICATION_KEY = 'time-tracker-notifications-enabled';
const EXCLUDED_HOURS_KEY = 'time-tracker-excluded-hours';

export function useNotifications() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem(NOTIFICATION_KEY) === 'true';
  });
  const [excludedHours, setExcludedHours] = useState(() => {
    const stored = localStorage.getItem(EXCLUDED_HOURS_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [selectionMode, setSelectionMode] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const intervalRef = useRef(null);

  const formatHour = (hour) => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  const sendNotification = useCallback(() => {
    const now = new Date();
    const previousHour = now.getHours() === 0 ? 23 : now.getHours() - 1;

    // Don't notify if this hour is excluded
    if (excludedHours.includes(previousHour)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Time Tracker', {
        body: `Log your activity for ${formatHour(previousHour)}`,
        icon: '/timetracker-icon.svg',
        tag: 'hourly-reminder'
      });
    }
  }, [excludedHours]);

  const setupHourlyNotification = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      clearTimeout(intervalRef.current);
    }

    const now = new Date();
    const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;

    const timeout = setTimeout(() => {
      sendNotification();
      intervalRef.current = setInterval(sendNotification, 60 * 60 * 1000);
    }, msUntilNextHour);

    intervalRef.current = timeout;
  }, [sendNotification]);

  const toggleEnabled = async () => {
    if (!enabled) {
      if (typeof Notification === 'undefined') {
        alert('Notifications are not supported in this browser');
        return;
      }

      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setPermissionGranted(permission === 'granted');
        if (permission !== 'granted') {
          alert('Please allow notifications to use this feature');
          return;
        }
      } else if (Notification.permission === 'denied') {
        alert('Notifications are blocked. Please enable them in your browser settings.');
        return;
      }

      setEnabled(true);
      localStorage.setItem(NOTIFICATION_KEY, 'true');
    } else {
      setEnabled(false);
      setSelectionMode(false);
      localStorage.setItem(NOTIFICATION_KEY, 'false');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        clearTimeout(intervalRef.current);
      }
    }
  };

  const toggleSelectionMode = () => {
    if (enabled) {
      setSelectionMode(prev => !prev);
    }
  };

  const toggleHourExclusion = (hour) => {
    setExcludedHours(prev => {
      const newExcluded = prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour];
      localStorage.setItem(EXCLUDED_HOURS_KEY, JSON.stringify(newExcluded));
      return newExcluded;
    });
  };

  useEffect(() => {
    if (enabled && permissionGranted) {
      setupHourlyNotification();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        clearTimeout(intervalRef.current);
      }
    };
  }, [enabled, permissionGranted, setupHourlyNotification]);

  return {
    enabled,
    excludedHours,
    selectionMode,
    toggleEnabled,
    toggleSelectionMode,
    toggleHourExclusion
  };
}
