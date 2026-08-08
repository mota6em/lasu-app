"use client";

import { Suspense, useState } from "react";
import SettingsLoader from "@/components/pages/settings/SettingsLoader";
import { Sidebar } from "@/components/fixedComponents/Sidebar";
import CommandPalette from "@/components/fixedComponents/CommandPalette";
import LanguageSwitcher from "@/components/fixedComponents/LanguageSwitcher";
import Footer from "@/components/fixedComponents/Footer";
import ScrollToTop from "@/components/fixedComponents/ScrollToTop";
import Topbar from "@/components/topbar/Topbar";
import { useLanguageDialog } from "@/store/useLanguageDialog";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isOpen: languageOpen, setOpen: setLanguageOpen } = useLanguageDialog();

  return (
    <div className="min-h-screen bg-background">
      <SettingsLoader />
      <CommandPalette />
      <Suspense fallback={null}>
        <LanguageSwitcher open={languageOpen} onOpenChange={setLanguageOpen} />
      </Suspense>
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
