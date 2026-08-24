import { routeMetadata } from "@/i18n/pageMetadata";

export const generateMetadata = routeMetadata({
  namespace: "welcome",
  path: "/dashboard/welcome",
  titleKey: "skip",
  descriptionKey: "subheading",
  noIndex: true,
});

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
