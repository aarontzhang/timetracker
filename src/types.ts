export interface LogEntry {
  id: string;
  category: string;
  timestamp: number;
  periodStart: number;
  periodEnd: number;
}

export interface Category {
  name: string;
  color: string;
  useCount: number;
  lastUsed: number;
  isDefault: boolean;
}

export interface Settings {
  intervalHours: number;
  sleepStart: string;
  sleepEnd: string;
  lastCheckInTime: number | null;
}

export interface AppState {
  logs: LogEntry[];
  categories: Category[];
  settings: Settings;
}
