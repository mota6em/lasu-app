import DashboardLayoutClient from "./DashboardLayoutClient";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
