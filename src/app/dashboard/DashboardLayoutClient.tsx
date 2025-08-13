"use client";
import { useState } from "react";
import SettingsLoader from "@/components/SettingsLoader";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 h-screen z-50">
        <SettingsLoader />
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>
      <div className="flex-1 lg:ml-56 flex flex-col bg-white dark:bg-zinc-900">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 dark:bg-zinc-900 mt-6 px-5 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
}
