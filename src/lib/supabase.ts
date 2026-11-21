import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// True only when both variables were provided at build time.
// The app uses this to show a clear setup message instead of a blank page.
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    !supabaseKey.includes("paste-your-publishable-key-here")
);

// Placeholder values keep the app from crashing on load when the
// variables are missing. No requests succeed until real values are set.
export const su
