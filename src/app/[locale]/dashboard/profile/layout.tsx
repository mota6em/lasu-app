import { routeMetadata } from "@/i18n/pageMetadata";

export const generateMetadata = routeMetadata({
  namespace: "profile",
  path: "/dashboard/profile",
  noIndex: true,
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
