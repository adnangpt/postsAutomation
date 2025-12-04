import dotenv from 'dotenv';

// Load env vars for when running from scripts
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

export async function generateContent(promptTemplate, platform) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Enhance prompt with platform-specific context
  const platformGuidelines = {
    x: `CRITICAL TWITTER RULES:
- Maximum 280 characters (STRICT LIMIT)
- Use 1-3 emojis strategically
- Make it VIRAL-WORTHY and shareable
- Use casual, Gen-Z friendly language
- Include humor or strong emotion
- NO hashtags unless specifically requested
- Make people want to like, retweet, and reply
- Think: "Would I engage with this tweet?"`,
    reddit: 'Write a detailed, informative post. Be conversational and authentic. Include context and value.',
    quora: 'Write a comprehensive, helpful answer. Use proper formatting with paragraphs. Be authoritative but friendly.'
  };

  const enhancedPrompt = `${promptTemplate}

PLATFORM: ${platform.toUpperCase()}
${platformGuidelines[platform] || ''}

IMPORTANT: Generate content that feels natural, not AI-generated. Be creative, witty, and authentic.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 1.0, // More creative for viral content
          topK: 40,
          topP: 0.95,
          maxOutputTokens: platform === 'x' ? 300 : 2048, // Slightly more for processing
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Platform-specific post-processing
    if (platform === 'x') {
      // Ensure it's under 280 characters
      return generatedText.substring(0, 280).trim();
    }
    
    return generatedText.trim();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
}

export async function generateContentWithRetry(promptTemplate, platform, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateContent(promptTemplate, platform);
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw lastError;
}
