const SUPABASE_URL = "https://ynjwyzdtbcondwukdfrj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inluand5emR0YmNvbmR3dWtkZnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNjU4MzcsImV4cCI6MjA5Nzk0MTgzN30.awW43tndl2PCRlsv9RhXLeZoQkq0Q-LguIPq6US_VIk";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);