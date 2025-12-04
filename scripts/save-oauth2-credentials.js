/**
 * Save OAuth 2.0 credentials to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { encrypt } from '../lib/encryption.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function saveCredentials() {
  try {
    console.log('\n💾 Saving OAuth 2.0 credentials to database...\n');

    // Read temporary credentials file
    if (!fs.existsSync('.oauth2-temp.json')) {
      console.error('❌ Error: .oauth2-temp.json not found');
      console.error('Please run: node scripts/setup-oauth2-flow.js first');
      process.exit(1);
    }

    const tempCreds = JSON.parse(fs.readFileSync('.oauth2-temp.json', 'utf-8'));

    // Prepare credentials object
    const credentials = {
      clientId: tempCreds.clientId,
      clientSecret: tempCreds.clientSecret,
      accessToken: tempCreds.accessToken,
      refreshToken: tempCreds.refreshToken,
      expiresIn: tempCreds.expiresIn,
      obtainedAt: tempCreds.obtainedAt
    };

    // Encrypt credentials
    const encryptedCredentials = encrypt(JSON.stringify(credentials));

    // Save to Supabase
    const { data, error } = await supabase
      .from('credentials')
      .upsert({
        platform: 'x',
        encrypted_credentials: encryptedCredentials,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'platform'
      })
      .select();

    if (error) {
      throw error;
    }

    console.log('✅ Credentials saved successfully to database!');
    console.log('Platform: x');
    console.log('Credentials encrypted and stored securely');

    // Delete temporary file
    fs.unlinkSync('.oauth2-temp.json');
    console.log('\n🗑️  Temporary file deleted');

    console.log('\n✅ Setup complete! You can now test posting a tweet:');
    console.log('node scripts/test-bot.js x "Your test message"\n');

  } catch (error) {
    console.error('\n❌ Error saving credentials:', error.message);
    process.exit(1);
  }
}

saveCredentials();
