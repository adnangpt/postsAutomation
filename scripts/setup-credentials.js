/**
 * Script to encrypt and store platform credentials in Supabase
 * Run with: node scripts/setup-credentials.js
 */

import { createClient } from '@supabase/supabase-js';
import { encrypt } from '../lib/encryption.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupCredentials() {
  console.log('Setting up platform credentials...\n');

  const credentials = [
    {
      platform: 'x',
      username: process.env.X_USERNAME,
      password: process.env.X_PASSWORD,
    },
    {
      platform: 'reddit',
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    },
    {
      platform: 'quora',
      email: process.env.QUORA_EMAIL,
      password: process.env.QUORA_PASSWORD,
    },
  ];

  for (const cred of credentials) {
    const { platform, ...credData } = cred;
    
    // Check if any required field is missing
    const missingFields = Object.entries(credData).filter(([_, value]) => !value);
    if (missingFields.length > 0) {
      console.log(`⚠️  Skipping ${platform.toUpperCase()}: Missing credentials in .env`);
      continue;
    }

    try {
      // Encrypt credentials
      const encryptedCreds = encrypt(JSON.stringify(credData));

      // Store in Supabase
      const { data, error } = await supabase
        .from('credentials')
        .upsert({
          platform,
          encrypted_credentials: encryptedCreds,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error(`❌ Error storing ${platform} credentials:`, error.message);
      } else {
        console.log(`✅ Successfully stored ${platform.toUpperCase()} credentials`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${platform}:`, error.message);
    }
  }

  console.log('\n✨ Credential setup complete!');
  process.exit(0);
}

setupCredentials().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
