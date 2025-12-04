/**
 * Viral Content Prompt Templates
 * Professionally crafted prompts that generate engaging, meme-worthy, trending content
 */

export const VIRAL_PROMPTS = {
  
  // MEME & HUMOR CATEGORY (70% of content)
  memes: [
    {
      name: "Tech Meme - Relatable",
      prompt: `Create a viral tech meme tweet that developers will instantly relate to. Use the "POV:" or "Me:" format. Include emojis. Make it funny and shareable. Topics: debugging, Stack Overflow, coffee, deadlines, or imposter syndrome. Under 250 characters.`
    },
    {
      name: "Programming Humor",
      prompt: `Write a witty programmer joke in tweet format. Use the setup-punchline structure. Make developers laugh and tag their coding friends. Include 2-3 relevant emojis. Keep it under 240 characters. Be clever and unexpected.`
    },
    {
      name: "Before/After Meme",
      prompt: `Create a "Before coding / After coding" comparison tweet. Make it relatable to developers' daily struggles. Use emojis to show the contrast. Funny, viral-worthy. Under 250 characters.`
    },
    {
      name: "Developer Life Meme",
      prompt: `Write a hilarious tweet about typical developer life: meetings, code reviews, merge conflicts, or production bugs. Use meme language (FR, NGL, POV, etc). 2-3 emojis. Make it go viral. Under 240 characters.`
    },
    {
      name: "Tech Struggle Tweet",
      prompt: `Create a funny tweet about common tech struggles: CSS alignment, naming variables, explaining code to non-techies, or browser compatibility. Relatable humor. Include emojis. Under 250 characters.`
    },
    {
      name: "Mood Meme",
      prompt: `Write a "Current mood as a developer:" style tweet. Describe the feeling using creative comparisons or meme references. Funny and shareable. 2-3 emojis. Under 240 characters.`
    },
    {
      name: "The Duality Meme",
      prompt: `Create a tweet showing programmer duality: "Me writing code vs Me reading my code from yesterday" format. Make it hilariously relatable. Use emojis. Under 250 characters.`
    },
    {
      name: "Expectation vs Reality",
      prompt: `Write an "Expectation vs Reality" tweet about coding, job interviews, or tech projects. Use humor and emojis. Make developers nod in agreement. Under 240 characters.`
    }
  ],

  // TRENDING & HOT TAKES (20% of content)
  trending: [
    {
      name: "AI Hot Take",
      prompt: `Write a clever, slightly controversial hot take about AI, ChatGPT, or automation. Make it thought-provoking but funny. Include an emoji. Not too serious, but engaging. Under 250 characters.`
    },
    {
      name: "Tech News Reaction",
      prompt: `React to a recent tech trend (AI, Web3, new frameworks, tech layoffs) with humor and insight. Be witty, not preachy. Use 1-2 emojis. Make people engage. Under 240 characters.`
    },
    {
      name: "Framework Wars Meme",
      prompt: `Create a funny tweet about framework/language wars (React vs Vue, Python vs JS, etc). Light-hearted roast. Include emojis. Don't be mean, be clever. Under 250 characters.`
    },
    {
      name: "Tech Industry Commentary",
      prompt: `Write a sharp, witty observation about tech culture: startup life, remote work, tech interviews, or Silicon Valley. Funny but true. 1-2 emojis. Under 240 characters.`
    }
  ],

  // MOTIVATIONAL WITH EDGE (10% of content)
  motivational: [
    {
      name: "Developer Motivation",
      prompt: `Write an inspiring but real tweet for developers. No toxic positivity. Acknowledge struggles but stay hopeful. Use 1 emoji. Make it feel authentic and shareable. Under 250 characters.`
    },
    {
      name: "Learning Journey",
      prompt: `Create a motivational tweet about learning to code or upskilling. Keep it genuine, not cheesy. Use personal tone like talking to a friend. 1-2 emojis. Under 240 characters.`
    },
    {
      name: "Failure to Success",
      prompt: `Write about embracing failure in coding. Make it relatable and encouraging without being preachy. Use humor if possible. 1 emoji. Authentic voice. Under 250 characters.`
    }
  ],

  // QUICK TIPS & VALUE (10% of content - bonus engagement)
  tips: [
    {
      name: "Mind-Blowing Tip",
      prompt: `Share a lesser-known productivity tip, keyboard shortcut, or dev tool hack. Start with "Pro tip:" or "Did you know:". Make it genuinely useful. 1 emoji. Under 240 characters.`
    },
    {
      name: "Tool Recommendation",
      prompt: `Recommend an underrated dev tool, VS Code extension, or website that saves time. Explain why it's awesome in one sentence. Enthusiastic tone. 1-2 emojis. Under 250 characters.`
    },
    {
      name: "Quick Learning Resource",
      prompt: `Share a free learning resource, tutorial, or cheat sheet for developers. Be specific and helpful. Excited tone like sharing a secret. 1 emoji. Under 240 characters.`
    }
  ]
};

/**
 * Get a random prompt from a specific category
 */
export function getRandomPrompt(category = 'memes') {
  const prompts = VIRAL_PROMPTS[category] || VIRAL_PROMPTS.memes;
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Get a random prompt following the content strategy:
 * 70% Memes, 20% Trending, 10% Motivational/Tips
 */
export function getRandomViralPrompt() {
  const rand = Math.random();
  
  if (rand < 0.7) {
    // 70% chance - Memes
    return getRandomPrompt('memes');
  } else if (rand < 0.9) {
    // 20% chance - Trending
    return getRandomPrompt('trending');
  } else if (rand < 0.95) {
    // 5% chance - Motivational
    return getRandomPrompt('motivational');
  } else {
    // 5% chance - Tips
    return getRandomPrompt('tips');
  }
}

/**
 * Get all prompts as a list for UI
 */
export function getAllPrompts() {
  return {
    'Memes & Humor (70%)': VIRAL_PROMPTS.memes,
    'Trending & Hot Takes (20%)': VIRAL_PROMPTS.trending,
    'Motivational (5%)': VIRAL_PROMPTS.motivational,
    'Quick Tips (5%)': VIRAL_PROMPTS.tips
  };
}
