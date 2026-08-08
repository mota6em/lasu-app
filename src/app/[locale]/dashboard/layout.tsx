import { routeMetadata } from "@/i18n/pageMetadata";
import DashboardLayoutClient from "./DashboardLayoutClient";

export const generateMetadata = routeMetadata({
  namespace: "nav",
  path: "/dashboard",
  titleKey: "translate",
  descriptionKey: "translateHint",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
