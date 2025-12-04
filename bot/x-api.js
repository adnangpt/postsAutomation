/**
 * X (Twitter) Bot using Official API
 * Much more reliable than browser automation
 * Supports both OAuth 1.0a and OAuth 2.0
 */

import { TwitterApi } from 'twitter-api-v2';
import { decrypt } from '../lib/encryption.js';

export async function runXBotAPI(settings) {
  const { content, credentials } = settings;
  
  if (!credentials || !credentials.encrypted_credentials) {
    throw new Error('X credentials not found');
  }

  const decryptedCreds = JSON.parse(decrypt(credentials.encrypted_credentials));
  
  console.log('Starting X (Twitter) API bot...');

  try {
    let client;
    
    // Check if OAuth 2.0 credentials are available
    if (decryptedCreds.clientId && decryptedCreds.clientSecret) {
      console.log('Using OAuth 2.0 authentication...');
      
      // For OAuth 2.0, we need an access token
      // If we have a bearer token, use it directly
      if (decryptedCreds.bearerToken) {
        client = new TwitterApi(decryptedCreds.bearerToken);
      } else if (decryptedCreds.accessToken) {
        // If we have an OAuth 2.0 access token
        client = new TwitterApi(decryptedCreds.accessToken);
      } else {
        throw new Error('OAuth 2.0 requires a bearer token or access token. Please complete the OAuth flow.');
      }
    } else {
      // Fallback to OAuth 1.0a
      console.log('Using OAuth 1.0a authentication...');
      const { apiKey, apiSecret, accessToken, accessSecret } = decryptedCreds;
      
      if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
        throw new Error('OAuth 1.0a requires apiKey, apiSecret, accessToken, and accessSecret');
      }
      
      client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken: accessToken,
        accessSecret: accessSecret,
      });
    }

    // Post tweet
    console.log('Posting tweet...');
    const tweet = await client.v2.tweet(content);
    
    console.log('Tweet posted successfully!');
    console.log('Tweet ID:', tweet.data.id);

    return {
      success: true,
      message: 'Tweet posted successfully via API',
      content: content,
      tweetId: tweet.data.id,
      url: `https://twitter.com/i/web/status/${tweet.data.id}`
    };

  } catch (error) {
    console.error('Error in X API bot:', error);
    throw error;
  }
}
