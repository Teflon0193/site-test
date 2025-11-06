"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User, Calendar, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export default function MemberLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { href: "/espace-membre", label: "Accueil", icon: User },
    { href: "/espace-membre/events", label: "Événements", icon: Calendar },
    { href: "/espace-membre/activities", label: "Mes activités", icon: Bell },
    { href: "/espace-membre/profile", label: "Mon profil", icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary text-primary-foreground transition-all duration-300 flex flex-col`}
      >
        {/* Header Sidebar */}
        <div className="p-6 border-b border-primary-foreground/20 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/espace-membre" className="font-bold text-lg">
              CCAPAC
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-primary-foreground/10 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary-foreground/20"
                      : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-foreground/20">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 bg-transparent"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
