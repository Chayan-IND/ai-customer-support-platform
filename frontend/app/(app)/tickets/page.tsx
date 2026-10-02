import { Ticket } from "lucide-react";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function TicketsPage() {
  return (
    <PlaceholderPage
      title="Support Tickets"
      description="View and create support tickets."
      icon={Ticket}
      plannedFeature="Planned: ticket list, ticket creation, and status tracking."
    />
  );
}