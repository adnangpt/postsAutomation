/**
 * Verification script to check if the AutoMarketer setup is complete
 * Run with: node scripts/verify-setup.js
 */

import { existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const checks = [];
let allPassed = true;

function check(name, condition, message) {
  const passed = condition;
  checks.push({ name, passed, message });
  if (!passed) allPassed = false;
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed && message) {
    console.log(`   → ${message}`);
  }
}

console.log('🔍 Verifying AutoMarketer Setup...\n');

// Check environment variables
console.log('📋 Environment Variables:');
check(
  'NEXT_PUBLIC_SUPABASE_URL',
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url',
  'Set your Supabase project URL in .env'
);

check(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-supabase-anon-key',
  'Set your Supabase anon key in .env'
);

check(
  'SUPABASE_SERVICE_ROLE_KEY',
  !!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key',
  'Set your Supabase service role key in .env'
);

check(
  'GEMINI_API_KEY',
  !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key',
  'Set your Google Gemini API key in .env'
);

check(
  'ENCRYPTION_KEY',
  !!process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY !== 'automarketer-secret-key-change-me',
  'Generate a secure encryption key in .env'
);

console.log('\n📁 Required Files:');
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'app/layout.js',
  'app/page.js',
  'app/globals.css',
  'bot/run.js',
  'bot/x.js',
  'bot/reddit.js',
  'bot/quora.js',
  'lib/supabaseClient.js',
  'lib/encryption.js',
  'lib/gemini.js',
  'supabase/schema.sql',
];

requiredFiles.forEach(file => {
  check(`File: ${file}`, existsSync(file), `Missing required file: ${file}`);
});

// Check Supabase connection
console.log('\n🔌 Database Connection:');
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Try to query the tasks table
    const { data, error } = await supabase.from('tasks').select('count').limit(1);
    
    check(
      'Supabase connection',
      !error,
      error ? `Database error: ${error.message}. Did you run the schema.sql?` : ''
    );
  } catch (error) {
    check('Supabase connection', false, `Connection failed: ${error.message}`);
  }
} else {
  check('Supabase connection', false, 'Supabase credentials not configured');
}

// Check platform credentials
console.log('\n🔑 Platform Credentials:');
check(
  'X (Twitter) credentials',
  !!process.env.X_USERNAME && !!process.env.X_PASSWORD,
  'Set X_USERNAME and X_PASSWORD in .env'
);

check(
  'Reddit credentials',
  !!process.env.REDDIT_USERNAME && !!process.env.REDDIT_PASSWORD,
  'Set REDDIT_USERNAME and REDDIT_PASSWORD in .env'
);

check(
  'Quora credentials',
  !!process.env.QUORA_EMAIL && !!process.env.QUORA_PASSWORD,
  'Set QUORA_EMAIL and QUORA_PASSWORD in .env'
);

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✨ All checks passed! Your setup looks good.');
  console.log('\nNext steps:');
  console.log('1. Run: node scripts/setup-credentials.js');
  console.log('2. Run: npm run dev');
  console.log('3. Open: http://localhost:3000');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
  console.log('\nRefer to SETUP.md for detailed instructions.');
}
console.log('='.repeat(50));

process.exit(allPassed ? 0 : 1);
