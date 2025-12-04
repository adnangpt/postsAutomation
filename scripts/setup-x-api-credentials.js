/**
 * Script to encrypt and store X API credentials in Supabase
 * Run with: node scripts/setup-x-api-credentials.js
 * 
 * X_USERNAME=thechillgu27573
X_PASSWORD=Adnan@8322

X_API_KEY=JJYHMgeeUGZcchjYdBEwNlr7u
X_API_SECRET=thd3QDbj3WlNenEsLiAN0L3L7oNqjFrOLFh7OHmshvqcQclwXk
X_API_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAID95gEAAAAAA%2FdBwiZ8XhFv0T93hKhWU9CgwSA%3DbmzR36GCs3W1aJaxRn9pOTLQyPjJqbxdb1H5GnokAZjxJuSRBx
X_ACCESS_TOKEN=1995446095573553152-UObYxmtl7T2yf78r9eibt2jdajEDuO
X_ACCESS_SECRET=Ca8KvXkOHkGPusS86D0NqMbquUXM25ZRh8R0Hk3rNv1dN


 */

import { createClient } from '@supabase/supabase-js';
import { encrypt } from '../lib/encryption.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupXAPICredentials() {
  console.log('Setting up X API credentials...\n');

  const credentials = {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  };

  // Check if all credentials are provided
  const missingFields = Object.entries(credentials).filter(([_, value]) => !value);
  
  if (missingFields.length > 0) {
    console.log('❌ Missing X API credentials in .env:');
    missingFields.forEach(([key]) => {
      console.log(`   - ${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
    });
    console.log('\nPlease add these to your .env file.');
    console.log('Get them from: https://developer.twitter.com/en/portal/dashboard\n');
    process.exit(1);
  }

  try {
    // Encrypt credentials
    const encryptedCreds = encrypt(JSON.stringify(credentials));

    // Delete existing X credentials first
    await supabase.from('credentials').delete().eq('platform', 'x');
    
    // Store new X API credentials in Supabase
    const { data, error } = await supabase
      .from('credentials')
      .insert({
        platform: 'x',
        encrypted_credentials: encryptedCreds,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('❌ Error storing X API credentials:', error.message);
      process.exit(1);
    }

    console.log('✅ Successfully stored X API credentials!');
    console.log('\nYou can now use:');
    console.log('  node scripts/test-x-api.js "Your tweet prompt"\n');

  } catch (error) {
    console.error('❌ Error processing X API credentials:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

setupXAPICredentials();
