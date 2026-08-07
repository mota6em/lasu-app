import { BarChart3, Globe2, History, Home, Sparkles } from "lucide-react";
import type { NavItem } from "@/lib/nav";

const ICONS = {
  home: Home,
  practice: Sparkles,
  history: History,
  stats: BarChart3,
  community: Globe2,
} as const;

export default function NavIcon({
  name,
  className,
}: {
  name: NavItem["icon"];
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={2} />;
}
