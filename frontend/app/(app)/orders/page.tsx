import { Package } from "lucide-react";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function OrdersPage() {
  return (
    <PlaceholderPage
      title="My Orders"
      description="Track and manage your orders."
      icon={Package}
      plannedFeature="Planned: order list and order details from the database."
    />
  );
}