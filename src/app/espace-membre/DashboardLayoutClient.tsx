"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiMenu,
  HiX,
  HiLogout,
  HiUser,
  HiCalendar,
  HiBell,
  HiCog,
  HiUsers,
  HiChartBar,
  HiHome,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import Image from "next/image";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    role: "MEMBER" | "ADMIN";
  };
  pendingApprovalsCount?: number;
}

export default function DashboardLayoutClient({
  children,
  user,
  pendingApprovalsCount = 0,
}: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Navigation différente selon le rôle
  const menuItems =
    user.role === "ADMIN"
      ? [
          { href: "/espace-membre/admin", label: "Dashboard", icon: HiHome },
          {
            href: "/espace-membre/admin/approvals",
            label: "Approbations",
            icon: HiBell,
            badge: pendingApprovalsCount,
          },
          {
            href: "/espace-membre/admin/members",
            label: "Membres",
            icon: HiUsers,
          },
          {
            href: "/espace-membre/admin/activities",
            label: "Activités",
            icon: HiChartBar,
          },
          {
            href: "/espace-membre/admin/events",
            label: "Événements",
            icon: HiCalendar,
          },
        ]
      : [
          { href: "/espace-membre", label: "Accueil", icon: HiUser },
          {
            href: "/espace-membre/events",
            label: "Événements",
            icon: HiCalendar,
          },
          {
            href: "/espace-membre/activities",
            label: "Mes activités",
            icon: HiBell,
          },
          {
            href: "/espace-membre/profile",
            label: "Mon profil",
            icon: HiCog,
          },
        ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between p-4">
          <Link
            href={
              user.role === "ADMIN" ? "/espace-membre/admin" : "/espace-membre"
            }
            className="font-bold text-lg uppercase"
          >
            <Image src="/logo.png" alt="CCAPAC" width={100} height={100} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground transition-transform duration-300 flex flex-col shadow-xl border-r border-primary-foreground/10 lg:flex`}
      >
        {/* Header Sidebar - Desktop only */}
        <div className="hidden lg:flex p-6 border-b border-primary-foreground/20 items-center justify-between">
          <Link
            href={
              user.role === "ADMIN" ? "/espace-membre/admin" : "/espace-membre"
            }
            className="font-bold text-xl uppercase drop-shadow-sm"
          >
            <Image src="/logo.png" alt="CCAPAC" width={300} height={100} />
          </Link>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="lg:hidden p-6 border-b border-primary-foreground/20">
          <Link
            href={
              user.role === "ADMIN" ? "/espace-membre/admin" : "/espace-membre"
            }
            className="font-bold text-xl uppercase drop-shadow-sm"
            onClick={closeMobileMenu}
          >
            <Image src="/logo.png" alt="CCAPAC" width={100} height={100} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-primary-foreground/20 shadow-md font-semibold"
                      : "hover:bg-primary-foreground/10 lg:hover:translate-x-1"
                  }`}
                >
                  <div className="relative">
                    <Icon size={20} />
                    {"badge" in item && item.badge && item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-primary-foreground/20">
          <div className="p-4 border-b border-primary-foreground/20 bg-primary-foreground/5">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-primary-foreground/70 truncate mt-0.5">
              {user.email}
            </p>
            {user.role === "ADMIN" && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-md">
                Administrateur
              </span>
            )}
          </div>
          <div className="p-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 bg-transparent hover:border-primary-foreground/50 transition-all"
            >
              <HiLogout size={20} />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-muted/5 via-background to-muted/10 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
