import { MessageSquare } from "lucide-react";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function ChatPage() {
  return (
    <PlaceholderPage
      title="AI Assistant"
      description="Chat with our support assistant about orders, returns, and refunds."
      icon={MessageSquare}
      plannedFeature="Planned: AI chat interface connected to the backend agent."
    />
  );
}
