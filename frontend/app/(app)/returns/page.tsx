import { RotateCcw } from "lucide-react";
import PlaceholderPage from "@/components/ui/PlaceholderPage";

export default function ReturnsPage() {
  return (
    <PlaceholderPage
      title="Returns & Refunds"
      description="Track your return and refund requests."
      icon={RotateCcw}
      plannedFeature="Planned: return and refund requests with approval status."
    />
  );
}