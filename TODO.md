# Time Tracker - TODO

## Completed

- [x] **Add cloud sync for data persistence**
  - Added Supabase integration for cloud sync
  - Data syncs automatically when Supabase is configured
  - See setup instructions below

- [x] **Add excluded hours on the logging screen & remove settings**
  - Quiet hours now displayed at bottom of logging screen
  - Settings screen removed

---

## Setup: Enable Cloud Sync

To enable cloud sync so your data persists across devices:

1. Create a free Supabase project at https://supabase.com
2. Go to Settings > API to get your URL and anon key
3. Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE time_tracker_data (
  device_id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE time_tracker_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON time_tracker_data
  FOR ALL USING (true) WITH CHECK (true);
```

4. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key

5. Redeploy

---

*Last updated: Feb 3, 2025*
