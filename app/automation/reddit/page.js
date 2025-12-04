import AutomationPageClient from '../AutomationPageClient';

export default function RedditAutomationPage() {
  return (
    <AutomationPageClient 
      platform="reddit"
      title="Reddit Automation"
      description="Configure automated posting to Reddit"
      defaultPrompt="Write an informative and engaging Reddit post about [topic]. Be conversational and provide value to the community."
      showSubreddit={true}
      showTitle={true}
    />
  );
}
