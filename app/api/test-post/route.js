import { TwitterApi } from 'twitter-api-v2';
import { createLog } from '@/lib/supabaseClient';
import { generateContentWithRetry } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, prompt_template, additional_settings } = body;

    if (!platform || !prompt_template) {
      return new Response(JSON.stringify({
        error: 'Platform and prompt_template are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate content with AI
    console.log('Generating content with Gemini AI...');
    const content = await generateContentWithRetry(prompt_template, platform);
    console.log('Generated content:', content);

    let result;

    // For X platform, use env vars directly (workaround for encryption issue)
    if (platform === 'x') {
      console.log('Posting to X using direct env vars...');
      
      const client = new TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_SECRET,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_SECRET,
      });

      const tweet = await client.v2.tweet(content);
      
      result = {
        success: true,
        message: 'Tweet posted successfully',
        content: content,
        tweetId: tweet.data.id,
        url: `https://twitter.com/i/web/status/${tweet.data.id}`
      };
    } else {
      // For other platforms, use the normal bot runner
      const { runBot } = await import('@/bot/run.js');
      result = await runBot({
        platform,
        prompt_template,
        additional_settings: additional_settings || {}
      });
    }

    // Log the test
    await createLog(null, `Test post successful on ${platform}`, 'info');

    return new Response(JSON.stringify({
      success: true,
      message: `Test post completed successfully on ${platform}!`,
      result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in test-post:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to run test post',
      details: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
