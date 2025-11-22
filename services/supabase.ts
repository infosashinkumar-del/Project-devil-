import { createClient } from '@supabase/supabase-js';

// Using the credentials provided in the user's original code
const SUPABASE_URL = 'https://fdpwnjrcjbyotnbafwhw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcHduanJjamJ5b3RuYmFmd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTcxNzQsImV4cCI6MjA3ODY5MzE3NH0.t1p4eUrsRXbI-NdpCfwZBG_jJ4hzYEk-iwZYWsIRj3c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const ADMIN_ID = 1;
export const ACTIVATION_COST = 150.00;