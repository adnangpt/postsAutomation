import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('Checking database tables...');
  
  // Check automation_settings
  const { data: settings, error: settingsError } = await supabase
    .from('automation_settings')
    .select('*');
    
  if (settingsError) {
    console.error('❌ Error accessing automation_settings:', settingsError.message);
  } else {
    console.log(`✅ automation_settings table exists. Found ${settings.length} rows.`);
    console.log('Settings:', JSON.stringify(settings, null, 2));
  }

  // Check automation_logs
  const { data: logs, error: logsError } = await supabase
    .from('automation_logs')
    .select('*')
    .limit(5);
    
  if (logsError) {
    console.error('❌ Error accessing automation_logs:', logsError.message);
  } else {
    console.log(`✅ automation_logs table exists. Found ${logs.length} rows (showing last 5).`);
    console.log('Logs:', JSON.stringify(logs, null, 2));
  }
}

checkTables();
