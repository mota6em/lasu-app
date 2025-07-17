import { Home, History, BarChart, Settings } from "lucide-react";
import Link from "next/link";



export function Sidebar() {
  const menu = [
    { label: "Overview", href: "/dashboard", icon: <Home size={20} /> },
    {
      label: "History",
      href: "/dashboard/history",
      icon: <History size={20} />,
    },
    { label: "Stats", href: "/dashboard/stats", icon: <BarChart size={20} /> },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen px-4 py-6">
      <h2 className="text-xl font-bold mb-6 lasu-logo">LaSu</h2>
      <nav className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
