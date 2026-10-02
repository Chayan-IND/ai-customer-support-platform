import type { LucideIcon } from "lucide-react";
import PageHeader from "./PageHeader";

type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  plannedFeature: string;
};

export default function PlaceholderPage({
  title,
  description,
  icon: Icon,
  plannedFeature,
}: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Icon size={24} />
        </div>
        <p className="mt-4 text-base font-medium text-slate-900">Not built yet</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{plannedFeature}</p>
      </div>
    </div>
  );
}