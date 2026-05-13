import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rgrkkwullcejtirowmty.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncmtrd3VsbGNlanRpcm93bXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzk2OTEsImV4cCI6MjA5NDI1NTY5MX0.iKRcrJ-f8WOlwtwf1cxJUApghuTyLk9Dxfsdfog35ao";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);