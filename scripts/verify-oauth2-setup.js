/**
 * Verify OAuth 2.0 Setup
 * Checks if all prerequisites are met before running the OAuth flow
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

dotenv.config();

console.log('\n🔍 Verifying OAuth 2.0 Setup...\n');

let hasErrors = false;

// Check 1: Environment variables
console.log('✓ Checking environment variables...');
const CLIENT_ID = process.env.X_OAUTH2_CLIENT_ID;
const CLIENT_SECRET = process.env.X_OAUTH2_CLIENT_SECRET;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!CLIENT_ID) {
  console.log('  ❌ X_OAUTH2_CLIENT_ID not found in .env');
  hasErrors = true;
} else {
  console.log('  ✅ X_OAUTH2_CLIENT_ID: ' + CLIENT_ID.substring(0, 10) + '...');
}

if (!CLIENT_SECRET) {
  console.log('  ❌ X_OAUTH2_CLIENT_SECRET not found in .env');
  hasErrors = true;
} else {
  console.log('  ✅ X_OAUTH2_CLIENT_SECRET: ' + CLIENT_SECRET.substring(0, 10) + '...');
}

if (!ENCRYPTION_KEY) {
  console.log('  ❌ ENCRYPTION_KEY not found in .env');
  hasErrors = true;
} else {
  console.log('  ✅ ENCRYPTION_KEY: Set');
}

if (!SUPABASE_URL) {
  console.log('  ❌ NEXT_PUBLIC_SUPABASE_URL not found in .env');
  hasErrors = true;
} else {
  console.log('  ✅ Supabase URL: ' + SUPABASE_URL);
}

if (!SUPABASE_KEY) {
  console.log('  ❌ SUPABASE_SERVICE_ROLE_KEY not found in .env');
  hasErrors = true;
} else {
  console.log('  ✅ Supabase Service Key: Set');
}

// Check 2: Supabase connection
console.log('\n✓ Checking Supabase connection...');
try {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase.from('credentials').select('platform').limit(1);
  
  if (error) {
    console.log('  ❌ Cannot connect to Supabase:', error.message);
    hasErrors = true;
  } else {
    console.log('  ✅ Supabase connection successful');
  }
} catch (error) {
  console.log('  ❌ Supabase connection failed:', error.message);
  hasErrors = true;
}

// Check 3: Required scripts exist
console.log('\n✓ Checking required files...');
const requiredFiles = [
  'scripts/setup-oauth2-flow.js',
  'scripts/save-oauth2-credentials.js',
  'app/api/auth/callback/route.js',
  'bot/x-api.js'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log('  ✅ ' + file);
  } else {
    console.log('  ❌ ' + file + ' not found');
    hasErrors = true;
  }
}

// Check 4: Node modules
console.log('\n✓ Checking required packages...');
const requiredPackages = ['twitter-api-v2', '@supabase/supabase-js', 'dotenv'];
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  for (const pkg of requiredPackages) {
    if (allDeps[pkg]) {
      console.log('  ✅ ' + pkg + ' (' + allDeps[pkg] + ')');
    } else {
      console.log('  ❌ ' + pkg + ' not installed');
      hasErrors = true;
    }
  }
} catch (error) {
  console.log('  ❌ Cannot read package.json');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Setup verification FAILED');
  console.log('\nPlease fix the errors above before proceeding.');
  console.log('\nFor help, see START_OAUTH2_NOW.md');
  process.exit(1);
} else {
  console.log('✅ All prerequisites met!');
  console.log('\n🎯 Next steps:');
  console.log('\n1. Configure X Developer Portal:');
  console.log('   - Add callback URL: http://localhost:3000/api/auth/callback');
  console.log('   - Enable "Read and Write" permissions');
  console.log('\n2. Run OAuth setup:');
  console.log('   node scripts/setup-oauth2-flow.js');
  console.log('\n3. Save credentials:');
  console.log('   node scripts/save-oauth2-credentials.js');
  console.log('\n4. Test the bot:');
  console.log('   node scripts/test-bot.js x "Test message"');
  console.log('\nFor detailed instructions, see: START_OAUTH2_NOW.md\n');
}
