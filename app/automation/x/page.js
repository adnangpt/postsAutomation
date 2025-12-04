import AutomationPageClient from '../AutomationPageClient';

export default function XAutomationPage() {

//   const postPrompt = `Write a viral, chaotic, slightly controversial Gen-Z style X post.
// Randomly pick ONE of these vibes (never mention which):

// 1️⃣ Disrespectfully honest truth nobody wants to admit
// 2️⃣ Hot take that starts playful outrage
// 3️⃣ Chaos-coded unhinged observation
// 4️⃣ Soft controversial opinion presented like a joke
// 5️⃣ Toxic inspirational quote (but funny, not harmful)
// 6️⃣ Mildly petty attack on modern life
// 7️⃣ Anti-productivity, anti-hustle, anti-grindset roast
// 8️⃣ Social commentary disguised as humor
// 9️⃣ Low-key villain arc energy
// 🔟 “I said what I said” attitude tweet

// Rules:
// • FIRST LINE must be a punch in the face.
// • Keep tone raw, unserious, sarcastic, chaotic-good.
// • 1–2 emojis MAX (only if they add spice).
// • STRICT 280 characters or less.
// • Make it feel like a human with wi-fi and trauma tweeted it.
// • Avoid being hateful; keep controversy fun, not harmful.
// • No explanations, disclaimers, or vibe labels.”

// 🧨 Example Outputs (So You Know The Flavor)

// 🔥 Controversial Truth:
// “Unpopular opinion: most people don’t have ‘high standards.’ They just have zero personality and don’t want to admit it.”

// 💥 Chaos Take:
// “Every adult is either in their villain arc or pretending they’re not. There’s no in-between.”

// 😂 Unhinged Observation:
// “Why does life feel like a simulation coded by an intern who rage-quit halfway?”

// 😤 Anti-Productivity:
// “Not to be controversial but… ‘grind culture’ is just burnout with a Canva poster.”

// 💀 Villain Arc Mode:
// “Some people say ‘the bare minimum.’ Bro, I say thank you when someone breathes near me. Standards are wild.”

// 🌪️ Spicy Opinion:
// “Thing about Gen Z is… we’ll call something toxic, stay with it, then tweet about healing.`

  const postPrompt = `“Write a trend-aware, high-engagement, mildly controversial Gen-Z style tweet.
Make it feel like it was posted by someone chronically online.

Follow these rules:

Mimic current trending topics on X (but do NOT mention specific ones).
Instead, reference trends indirectly using patterns like:
• “everyone arguing about that thing again”
• “today’s main character energy”
• “the timeline is on fire over this”
• “bro this app is melting down because…”
This makes the tweet feel hyper-relevant without needing live trend data.

Randomly choose ONE type of chaos:
• internet drama take
• pop-culture micro-controversy
• celebrity shade
• meme reaction to “what’s trending rn”
• delulu Gen-Z social commentary
• relationship hot-take tied to a trend
• “society is cooked” observation
• influencer/creator shade
• tech or AI hysteria joke
• viral moment sarcasm

Write the tweet in a chaotic, funny, sarcastic, slightly toxic Gen-Z tone.

Start with a punchline or shock statement.

Use 4–8 trend-style hashtags, including:
#TrendingNow
#ForYou
#GenZ
#HotTake
#DramaAlert
#UnpopularOpinion
#ChronicallyOnline
#SideEye
#Viral
#InternetCulture
#MemeTok
#TeaTime
#FYP
#PopCulture

Make it feel connected to trends:
• “why is everyone suddenly doing this?”
• “this trend is getting out of hand”
• “bro this app is arguing about nonsense again”
• “can we talk about the chaos happening rn??”
• “y’all are too invested in this storyline”

Keep it under 280 characters.

No explanations. No disclaimers.”

🔥 EXAMPLES (These feel TRNDING without needing real trend data)
Example 1

“Why is everyone acting like they weren’t dragging this trend last week?? The timeline has zero loyalty 💀
#TrendingNow #DramaAlert #GenZ #TeaTime #InternetCulture #HotTake #ChronicallyOnline”

Example 2

“Every day X picks a random civilian to be ‘main character of the day’ and y’all NEVER disappoint 😭
#ForYou #MemeTok #InternetCulture #Viral #SideEye #Trending”

Example 3

“This app is beefing over the dumbest trend again and honestly I’m here for the chaos.”
#GenZ #TrendingNow #DramaAlert #ViralTweet #ChronicallyOnline #TeaTime

Example 4

“Why is this new trend giving ‘we have collectively lost the plot’ energy?”
#HotTake #GenZHumor #Viral #SideEye #Trending #InternetCulture`



  return (
    <AutomationPageClient 
      platform="x"
      title="X (Twitter) Automation"
      description="Configure automated posting to X (Twitter)"
      // defaultPrompt="Write an engaging tweet about [topic]. Keep it under 280 characters and include relevant hashtags."
      defaultPrompt={postPrompt}
    />
  );
}
