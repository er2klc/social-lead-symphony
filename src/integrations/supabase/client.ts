import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://agqaitxlmxztqyhpcjau.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncWFpdHhsbXh6dHF5aHBjamF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NjgxMjEsImV4cCI6MjA1MDQ0NDEyMX0.rhw4HkZkSMWYOiNRHhQJwNYEk86ZsMEkORRel1aQJY4";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);