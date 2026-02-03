import { useState, useEffect } from 'react';

const STORAGE_KEY = 'time-tracker-data';

export function useStorage() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const getDay = (dateStr) => {
    return data[dateStr] || {};
  };

  const setActivity = (dateStr, hour, activity) => {
    setData(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: activity
      }
    }));
  };

  const clearActivity = (dateStr, hour) => {
    setData(prev => {
      const dayData = { ...prev[dateStr] };
      delete dayData[hour];
      return {
        ...prev,
        [dateStr]: dayData
      };
    });
  };

  return { data, getDay, setActivity, clearActivity };
}
