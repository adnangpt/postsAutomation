import { generateContentWithRetry } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt_template, platform } = body;

    if (!prompt_template || !platform) {
      return new Response(JSON.stringify({
        error: 'prompt_template and platform are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const content = await generateContentWithRetry(prompt_template, platform);

    return new Response(JSON.stringify({
      success: true,
      content
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Failed to generate content'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
