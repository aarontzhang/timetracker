import { useEffect, useCallback } from 'react';
import type { Settings } from '../types';

export function useNotifications(settings: Settings) {
  const isInSleepWindow = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [sleepStartHour, sleepStartMin] = settings.sleepStart.split(':').map(Number);
    const [sleepEndHour, sleepEndMin] = settings.sleepEnd.split(':').map(Number);

    const sleepStart = sleepStartHour * 60 + sleepStartMin;
    const sleepEnd = sleepEndHour * 60 + sleepEndMin;

    if (sleepStart > sleepEnd) {
      return currentTime >= sleepStart || currentTime < sleepEnd;
    }
    return currentTime >= sleepStart && currentTime < sleepEnd;
  }, [settings.sleepStart, settings.sleepEnd]);

  const scheduleNextNotification = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const intervalMs = settings.intervalHours * 60 * 60 * 1000;

    let delay = intervalMs;

    if (settings.lastCheckInTime) {
      const nextCheckIn = settings.lastCheckInTime + intervalMs;
      delay = Math.max(0, nextCheckIn - Date.now());
    }

    // If we're in sleep window, delay until sleep ends
    if (isInSleepWindow()) {
      const [sleepEndHour, sleepEndMin] = settings.sleepEnd.split(':').map(Number);
      const now = new Date();
      const sleepEnd = new Date(now);
      sleepEnd.setHours(sleepEndHour, sleepEndMin, 0, 0);

      if (sleepEnd <= now) {
        sleepEnd.setDate(sleepEnd.getDate() + 1);
      }

      delay = Math.max(delay, sleepEnd.getTime() - now.getTime());
    }

    // Only schedule if there's actually a delay (don't spam notifications)
    if (delay > 0) {
      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        delay,
        intervalHours: settings.intervalHours
      });
    }
  }, [settings.intervalHours, settings.lastCheckInTime, settings.sleepEnd, isInSleepWindow]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  useEffect(() => {
    scheduleNextNotification();
  }, [scheduleNextNotification]);

  return { scheduleNextNotification, isInSleepWindow };
}
