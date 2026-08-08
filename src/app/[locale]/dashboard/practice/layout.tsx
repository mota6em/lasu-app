import { routeMetadata } from "@/i18n/pageMetadata";

export const generateMetadata = routeMetadata({
  namespace: "practice",
  path: "/dashboard/practice",
  titleKey: "badge",
  descriptionKey: "subheading",
});

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
