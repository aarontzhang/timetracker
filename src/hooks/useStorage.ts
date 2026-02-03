import { useState, useEffect, useCallback } from 'react';
import type { AppState, LogEntry, Category, Settings } from '../types';
import { supabase, getDeviceId } from '../lib/supabase';

const STORAGE_KEY = 'time-tracker-data';

const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Work', color: '#3b82f6', useCount: 0, lastUsed: 0, isDefault: true },
  { name: 'Study', color: '#8b5cf6', useCount: 0, lastUsed: 0, isDefault: true },
  { name: 'Rest', color: '#10b981', useCount: 0, lastUsed: 0, isDefault: true },
  { name: 'Social', color: '#f59e0b', useCount: 0, lastUsed: 0, isDefault: true },
  { name: 'Exercise', color: '#ef4444', useCount: 0, lastUsed: 0, isDefault: true },
  { name: 'Other', color: '#6b7280', useCount: 0, lastUsed: 0, isDefault: true },
];

const DEFAULT_SETTINGS: Settings = {
  intervalHours: 1,
  sleepStart: '23:00',
  sleepEnd: '07:00',
  lastCheckInTime: null,
};

const getInitialState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return {
    logs: [],
    categories: DEFAULT_CATEGORIES,
    settings: DEFAULT_SETTINGS,
  };
};

export function useStorage() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [state]);

  // Sync to cloud
  const syncToCloud = useCallback(async (data: AppState) => {
    if (!supabase) return;

    setSyncStatus('syncing');
    try {
      const deviceId = getDeviceId();
      const { error } = await supabase
        .from('time_tracker_data')
        .upsert({
          device_id: deviceId,
          data: data,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'device_id'
        });

      if (error) throw error;
      setSyncStatus('synced');
    } catch (e) {
      console.error('Failed to sync to cloud:', e);
      setSyncStatus('error');
    }
  }, []);

  // Load from cloud on initial mount
  useEffect(() => {
    const loadFromCloud = async () => {
      if (!supabase) return;

      try {
        const deviceId = getDeviceId();
        const { data, error } = await supabase
          .from('time_tracker_data')
          .select('data')
          .eq('device_id', deviceId)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // Not found is ok
            console.error('Failed to load from cloud:', error);
          }
          return;
        }

        if (data?.data) {
          // Merge cloud data with local (cloud wins for conflicts)
          const cloudState = data.data as AppState;
          const localState = getInitialState();

          // Merge logs (combine and dedupe by id)
          const allLogs = [...localState.logs, ...cloudState.logs];
          const uniqueLogs = allLogs.filter((log, index, self) =>
            index === self.findIndex(l => l.id === log.id)
          );

          setState({
            ...cloudState,
            logs: uniqueLogs.sort((a, b) => b.timestamp - a.timestamp),
          });
        }
      } catch (e) {
        console.error('Failed to load from cloud:', e);
      }
    };

    loadFromCloud();
  }, []);

  // Sync to cloud whenever state changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      syncToCloud(state);
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [state, syncToCloud]);

  const addLog = useCallback((category: string) => {
    const now = Date.now();
    const intervalMs = state.settings.intervalHours * 60 * 60 * 1000;

    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      category,
      timestamp: now,
      periodStart: now - intervalMs,
      periodEnd: now,
    };

    setState(prev => {
      const updatedCategories = prev.categories.map(cat =>
        cat.name === category
          ? { ...cat, useCount: cat.useCount + 1, lastUsed: now }
          : cat
      );

      const categoryExists = updatedCategories.some(cat => cat.name === category);
      if (!categoryExists) {
        updatedCategories.push({
          name: category,
          color: getRandomColor(),
          useCount: 1,
          lastUsed: now,
          isDefault: false,
        });
      }

      return {
        ...prev,
        logs: [...prev.logs, newLog],
        categories: updatedCategories,
        settings: {
          ...prev.settings,
          lastCheckInTime: now,
        },
      };
    });

    return newLog;
  }, [state.settings.intervalHours]);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const getSortedCategories = useCallback(() => {
    return [...state.categories].sort((a, b) => {
      if (b.useCount !== a.useCount) return b.useCount - a.useCount;
      return b.lastUsed - a.lastUsed;
    });
  }, [state.categories]);

  const getCheckInStatus = useCallback(() => {
    const now = Date.now();
    const intervalMs = state.settings.intervalHours * 60 * 60 * 1000;
    const lastCheckIn = state.settings.lastCheckInTime;

    if (!lastCheckIn) {
      // First time user - check-in is due immediately
      return { isDue: true, nextCheckInAt: null, timeUntilNext: 0 };
    }

    const nextCheckInAt = lastCheckIn + intervalMs;
    const timeUntilNext = nextCheckInAt - now;

    return {
      isDue: timeUntilNext <= 0,
      nextCheckInAt,
      timeUntilNext: Math.max(0, timeUntilNext),
    };
  }, [state.settings.lastCheckInTime, state.settings.intervalHours]);

  return {
    logs: state.logs,
    categories: state.categories,
    settings: state.settings,
    syncStatus,
    addLog,
    updateSettings,
    getSortedCategories,
    getCheckInStatus,
  };
}

function getRandomColor(): string {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];
  return colors[Math.floor(Math.random() * colors.length)];
}
