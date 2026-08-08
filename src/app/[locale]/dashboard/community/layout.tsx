import { routeMetadata } from "@/i18n/pageMetadata";

export const generateMetadata = routeMetadata({
  namespace: "community",
  path: "/dashboard/community",
  descriptionKey: "joinBody",
});

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
