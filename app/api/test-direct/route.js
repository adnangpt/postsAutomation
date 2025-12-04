import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { generateContentWithRetry } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt_template } = body;

    console.log('Testing direct X API without stored credentials...');
    
    // Use credentials directly from environment
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_SECRET,
    });

    // Generate content
    const content = await generateContentWithRetry(prompt_template, 'x');
    console.log('Generated content:', content);

    // Post tweet
    const tweet = await client.v2.tweet(content);
    
    return NextResponse.json({
      success: true,
      message: 'Tweet posted successfully via direct env vars!',
      content: content,
      tweetId: tweet.data.id,
      url: `https://twitter.com/i/web/status/${tweet.data.id}`
    });

  } catch (error) {
    console.error('Error in test-direct:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to post',
        details: error.stack
      },
      { status: 500 }
    );
  }
}
