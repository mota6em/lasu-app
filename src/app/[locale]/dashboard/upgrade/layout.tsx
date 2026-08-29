import { routeMetadata } from "@/i18n/pageMetadata";

export const generateMetadata = routeMetadata({
  namespace: "billing",
  path: "/dashboard/upgrade",
  titleKey: "heading",
  descriptionKey: "subtitle",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
