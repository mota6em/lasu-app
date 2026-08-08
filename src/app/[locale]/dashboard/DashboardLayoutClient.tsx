"use client";

import { useState } from "react";
import SettingsLoader from "@/components/pages/settings/SettingsLoader";
import { Sidebar } from "@/components/fixedComponents/Sidebar";
import CommandPalette from "@/components/fixedComponents/CommandPalette";
import Footer from "@/components/fixedComponents/Footer";
import ScrollToTop from "@/components/fixedComponents/ScrollToTop";
import Topbar from "@/components/topbar/Topbar";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SettingsLoader />
      <CommandPalette />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex min-h-screen flex-col lg:ps-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <Footer />
      </div>

      <ScrollToTop />
    </div>
  );
}
