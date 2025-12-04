/**
 * OAuth 2.0 Setup for X (Twitter) API
 * This script helps you complete the OAuth 2.0 flow to get an access token
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const CLIENT_ID = process.env.X_OAUTH2_CLIENT_ID;
const CLIENT_SECRET = process.env.X_OAUTH2_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: X_OAUTH2_CLIENT_ID and X_OAUTH2_CLIENT_SECRET must be set in .env file');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupOAuth2() {
  console.log('\n🔐 X (Twitter) OAuth 2.0 Setup\n');
  console.log('This will guide you through getting an OAuth 2.0 access token.\n');

  try {
    // Initialize Twitter API client with OAuth 2.0
    const client = new TwitterApi({ 
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    });

    // Generate OAuth 2.0 authorization URL
    const callbackUrl = process.env.CALLBACK_URL || 'http://localhost:3000/api/auth/callback';
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      callbackUrl,
      { 
        scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'] 
      }
    );

    console.log('Step 1: Open this URL in your browser:');
    console.log('\n' + url + '\n');
    console.log('Step 2: Authorize the app and copy the full callback URL you are redirected to');
    console.log('        (It will look like: ' + callbackUrl + '?state=...&code=...)');
    
    const providedCallbackUrl = await question('\nPaste the full callback URL here: ');
    
    // Extract code from callback URL
    const urlParams = new URL(providedCallbackUrl).searchParams;
    const code = urlParams.get('code');
    const returnedState = urlParams.get('state');

    if (!code) {
      throw new Error('No authorization code found in callback URL');
    }

    if (returnedState !== state) {
      throw new Error('State mismatch - possible CSRF attack');
    }

    console.log('\n✅ Authorization code received');
    console.log('Step 3: Exchanging code for access token...\n');

    // Exchange code for access token
    const { client: loggedClient, accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: callbackUrl
    });

    console.log('✅ OAuth 2.0 tokens obtained successfully!\n');
    console.log('📋 Your OAuth 2.0 Credentials:\n');
    console.log('Access Token:', accessToken);
    if (refreshToken) {
      console.log('Refresh Token:', refreshToken);
    }
    console.log('Expires In:', expiresIn, 'seconds');
    
    console.log('\n⚠️  IMPORTANT: Save these credentials in your database:');
    console.log('\nRun this command to save them:');
    console.log('\nnode scripts/save-oauth2-credentials.js\n');
    
    // Test the connection
    console.log('Testing connection...');
    const me = await loggedClient.v2.me();
    console.log('\n✅ Successfully authenticated as:', me.data.username);
    console.log('User ID:', me.data.id);

    // Save to a temporary file for the next script
    const fs = await import('fs');
    fs.writeFileSync('.oauth2-temp.json', JSON.stringify({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      accessToken,
      refreshToken,
      expiresIn,
      obtainedAt: new Date().toISOString()
    }, null, 2));

    console.log('\n✅ Temporary credentials saved to .oauth2-temp.json');
    console.log('Run: node scripts/save-oauth2-credentials.js to save them to the database\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.data) {
      console.error('Details:', JSON.stringify(error.data, null, 2));
    }
  } finally {
    rl.close();
  }
}

setupOAuth2();
