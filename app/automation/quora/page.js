import AutomationPageClient from '../AutomationPageClient';

export default function QuoraAutomationPage() {
  return (
    <AutomationPageClient 
      platform="quora"
      title="Quora Automation"
      description="Configure automated answers on Quora"
      defaultPrompt="Write a comprehensive, helpful answer about [topic]. Use proper formatting and be authoritative but friendly."
      showQuestionUrl={true}
    />
  );
}
