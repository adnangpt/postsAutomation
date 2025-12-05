/**
 * Viral Content Prompt Templates
 * Professionally crafted prompts that generate engaging, meme-worthy, trending content
 */

export const VIRAL_PROMPTS = {
  
  // RELATABLE STORIES & OBSERVATIONS (40% of content)
  stories: [
    {
      name: "Specific Coding Moment",
      prompt: `Write about a SPECIFIC coding moment everyone experiences: finding a bug that was just a typo, code working after random changes, or copying Stack Overflow without understanding. Tell it like a mini-story. Natural language, 1-2 emojis MAX. 2 hashtags only. Under 240 characters.`
    },
    {
      name: "Workplace Reality",
      prompt: `Share a brutally honest observation about work: useless meetings, "quick calls" that aren't quick, or being interrupted mid-focus. Make it funny because it's TRUE. Conversational tone. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Life Comparison",
      prompt: `Compare coding to something unexpected (cooking, dating, parenting, sports). Make the comparison clever and funny. Example: "Debugging is like looking for your phone while you're on it." Natural voice. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Confession Tweet",
      prompt: `Start with "Confession:" and admit something relatable but slightly embarrassing about coding/work. Make it human and funny. Example: "Confession: I Google the same thing every week." Honest tone. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Weekend vs Monday",
      prompt: `Contrast weekend you vs Monday you, or before coffee vs after coffee. Make it visual and relatable. Use specific details, not generic statements. Funny. 1-2 emojis. 2 hashtags. Under 240 characters.`
    }
  ],

  // CONTROVERSIAL OPINIONS (30% of content - drives engagement)
  opinions: [
    {
      name: "Unpopular Opinion",
      prompt: `Start with "Unpopular opinion:" and share a mildly controversial tech take that will make people argue in replies. Examples: "tabs vs spaces", "testing is overrated", "AI won't replace us". Confident tone. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Hot Take",
      prompt: `Share a spicy take about tech trends, tools, or practices. Make it provocative but not offensive. Example: "Everyone pretending to understand blockchain." Bold. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Truth Bomb",
      prompt: `Drop a harsh truth about the tech industry that everyone knows but doesn't say. Example: "Most 'senior' devs just Google better." Sharp but funny. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Overrated/Underrated",
      prompt: `Say what's overrated and what's underrated in tech. Be specific. Example: "Overrated: 10x engineers. Underrated: good documentation." Direct. 1 emoji. 2 hashtags. Under 240 characters.`
    }
  ],

  // ACTUAL HUMOR (20% of content)
  humor: [
    {
      name: "Absurd Scenario",
      prompt: `Describe an absurd but relatable coding scenario. Example: "Spent 2 hours debugging. Problem was I wasn't running the code." Make it funny through specificity. Natural language. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Self-Deprecating",
      prompt: `Make fun of yourself about coding/work. Example: "My code reviews are just me apologizing for existing." Funny and relatable. Humble tone. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Exaggeration",
      prompt: `Exaggerate a common coding experience for comedic effect. Example: "I've been 'almost done' with this feature for 3 weeks." Funny because it's true. 1 emoji. 2 hashtags. Under 240 characters.`
    }
  ],

  // QUESTIONS & ENGAGEMENT BAIT (10% of content)
  engagement: [
    {
      name: "Relatable Question",
      prompt: `Ask a question that will get tons of replies. Example: "What's the dumbest bug you've spent hours on?" or "What's your most-used keyboard shortcut?" Conversational. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "Fill in the Blank",
      prompt: `Create a "fill in the blank" tweet. Example: "The best part of coding is ___. The worst part is ___." Make it fun to answer. 1 emoji. 2 hashtags. Under 240 characters.`
    },
    {
      name: "This or That",
      prompt: `Ask a "this or that" question about tech. Example: "Vim or VS Code?" or "Tabs or spaces?" Simple but gets engagement. 1 emoji. 2 hashtags. Under 240 characters.`
    }
  ]
};

/**
 * Get a random prompt from a specific category
 */
export function getRandomPrompt(category = 'stories') {
  const prompts = VIRAL_PROMPTS[category] || VIRAL_PROMPTS.stories;
  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex];
}

/**
 * Get a random prompt following the engagement-focused strategy:
 * 40% Stories, 30% Opinions, 20% Humor, 10% Engagement Questions
 */
export function getRandomViralPrompt() {
  const rand = Math.random();
  
  if (rand < 0.4) {
    // 40% chance - Relatable Stories
    return getRandomPrompt('stories');
  } else if (rand < 0.7) {
    // 30% chance - Controversial Opinions (drives engagement!)
    return getRandomPrompt('opinions');
  } else if (rand < 0.9) {
    // 20% chance - Actual Humor
    return getRandomPrompt('humor');
  } else {
    // 10% chance - Engagement Questions
    return getRandomPrompt('engagement');
  }
}

/**
 * Get all prompts as a list for UI
 */
export function getAllPrompts() {
  return {
    'Relatable Stories (40%)': VIRAL_PROMPTS.stories,
    'Controversial Opinions (30%)': VIRAL_PROMPTS.opinions,
    'Actual Humor (20%)': VIRAL_PROMPTS.humor,
    'Engagement Questions (10%)': VIRAL_PROMPTS.engagement
  };
}
