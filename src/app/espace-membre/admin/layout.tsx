"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BarChart3, Calendar, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "admin",
      icon: Home,
    },
    {
      label: "Membres",
      href: "admin/members",
      icon: Users,
    },
    {
      label: "Activités",
      href: "admin/activities",
      icon: BarChart3,
    },
    {
      label: "Événements",
      href: "admin/events",
      icon: Calendar,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        {/* Logo */}
        <div className="border-b border-border p-6">
          <Link href="/" className="text-xl font-bold text-primary">
            CCAPAC Admin
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-foreground/70 hover:bg-accent"
          >
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
