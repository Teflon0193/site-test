"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Loader2,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as PrismaUserType } from "@prisma/client";
import Image from "next/image";
import { logoutAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: PrismaUserType;
}

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems =
    user.role === "ADMIN"
      ? [
          {
            href: "/espace-membre/admin",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            href: "/espace-membre/admin/members",
            label: "Membres",
            icon: Users,
          },
          {
            href: "/espace-membre/admin/events",
            label: "Événements",
            icon: Calendar,
          },
          {
            href: "/espace-membre/admin/suggestions",
            label: "Suggestions",
            icon: MessageSquare,
          },
        ]
      : [
          { href: "/espace-membre", label: "Accueil", icon: Home },
          {
            href: "/espace-membre/events",
            label: "Événements",
            icon: Calendar,
          },
          {
            href: "/espace-membre/suggestions",
            label: "Suggestions",
            icon: MessageSquare,
          },
          {
            href: "/espace-membre/profile",
            label: "Mon profil",
            icon: User,
          },
        ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        toast.success(result.message || "Déconnexion réussie");
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la déconnexion");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Une erreur inattendue s'est produite");
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-primary border-b px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg uppercase">
          <Image
            src="/logo.png"
            alt="CCAPAC"
            width={120}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-primary border-r transition-transform duration-300 flex flex-col",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header Sidebar - Desktop only */}
        <div className="hidden lg:flex h-20 items-center px-6 border-b">
          <Link href="/" className="block">
            <Image
              src="/logo.png"
              alt="CCAPAC"
              width={160}
              height={80}
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="lg:hidden h-16 flex items-center px-6 border-b">
          <span className="font-semibold text-lg">Menu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  <span
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                      active
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="relative">
                      <Icon size={18} />
                      {"badge" in item &&
                        typeof item.badge === "number" &&
                        item.badge > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                    </div>
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t bg-muted/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="h-10 w-10">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 text-muted-foreground font-bold hover:text-destructive hover:bg-destructive/10"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
            <span>{isLoggingOut ? "Déconnexion..." : "Déconnexion"}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
