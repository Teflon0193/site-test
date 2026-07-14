"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  BadgeDollarSign,
  Calendar,
  ClipboardList,
  FileClock,
  FilePlus2,
  Gavel,
  HandCoins,
  History,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Palette,
  Radio,
  User,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import type {
  User as AppUser,
} from "@/services/auth";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: AppUser;
}

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardConfig {
  name: string;
  shortName: string;
  home: string;
  menuItems: MenuItem[];
}

const dashboardConfigs: Record<
  string,
  DashboardConfig
> = {
  MEMBER: {
    name: "Espace membre",
    shortName: "MEMBRE",
    home: "/espace-membre/membre",

    menuItems: [
      {
        href: "/espace-membre/membre",
        label: "Accueil",
        icon: Home,
      },
      {
        href: "/espace-membre/membre/nouvelle-demande",
        label: "Nouvelle demande",
        icon: FilePlus2,
      },
      {
        href: "/espace-membre/membre/demandes",
        label: "Mes demandes",
        icon: ClipboardList,
      },
      {
        href: "/espace-membre/membre/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  PROGRAMME: {
    name: "Service des Programmes",
    shortName: "PROGRAMME",
    home: "/espace-membre/programme",

    menuItems: [
      {
        href: "/espace-membre/programme",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/programme/demandes",
        label: "Demandes à traiter",
        icon: ClipboardList,
      },
      {
        href: "/espace-membre/programme/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  REGISSEUR_GENERAL: {
    name: "Régisseur général",
    shortName: "RÉGISSEUR",
    home: "/espace-membre/regisseur",

    menuItems: [
      {
        href: "/espace-membre/regisseur",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/regisseur/demandes",
        label: "Demandes à traiter",
        icon: Wrench,
      },
      {
        href: "/espace-membre/regisseur/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  DIRECTION_ARTISTIQUE: {
    name: "Direction artistique",
    shortName: "DIRECTION ARTISTIQUE",
    home: "/espace-membre/direction-artistique",

    menuItems: [
      {
        href: "/espace-membre/direction-artistique",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/direction-artistique/demandes",
        label: "Demandes à traiter",
        icon: Palette,
      },
      {
        href: "/espace-membre/direction-artistique/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  COMMUNICATION: {
    name: "Communication et Marketing",
    shortName: "COMMUNICATION",
    home: "/espace-membre/communication",

    menuItems: [
      {
        href: "/espace-membre/communication",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/communication/demandes",
        label: "Demandes à traiter",
        icon: Radio,
      },
      {
        href: "/espace-membre/communication/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  JURIDIQUE: {
    name: "Service juridique",
    shortName: "JURIDIQUE",
    home: "/espace-membre/juridique",

    menuItems: [
      {
        href: "/espace-membre/juridique",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/juridique/demandes",
        label: "Demandes à traiter",
        icon: Gavel,
      },
      {
        href: "/espace-membre/juridique/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  FINANCE: {
    name: "Service des Finances",
    shortName: "FINANCE",
    home: "/espace-membre/finance",

    menuItems: [
      {
        href: "/espace-membre/finance",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/finance/demandes",
        label: "Demandes à traiter",
        icon: BadgeDollarSign,
      },
      {
        href: "/espace-membre/finance/historique",
        label: "Historique",
        icon: History,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  SUPERVISEUR: {
    name: "Espace de supervision",
    shortName: "SUPERVISEUR",
    home: "/espace-membre/superviseur",

    menuItems: [
      {
        href: "/espace-membre/superviseur",
        label: "Vue globale",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/superviseur/utilisateurs",
        label: "Utilisateurs et rôles",
        icon: Users,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },

  ADMIN: {
    name: "Administration",
    shortName: "ADMINISTRATEUR",
    home: "/espace-membre/admin",

    menuItems: [
      {
        href: "/espace-membre/admin",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
      {
        href: "/espace-membre/admin/members",
        label: "Utilisateurs",
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
      {
        href: "/espace-membre/admin/fundraising",
        label: "Dons",
        icon: HandCoins,
      },
      {
        href: "/espace-membre/profile",
        label: "Mon profil",
        icon: User,
      },
    ],
  },
};

const fallbackConfig: DashboardConfig = {
  name: "Espace professionnel",
  shortName: "UTILISATEUR",
  home: "/espace-membre",

  menuItems: [
    {
      href: "/espace-membre/profile",
      label: "Mon profil",
      icon: User,
    },
  ],
};

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  const config =
    dashboardConfigs[user.role] ||
    fallbackConfig;

  const fullName =
    `${user.first_name || ""} ${
      user.last_name || ""
    }`.trim() || user.email;

  const initials =
    [
      user.first_name?.charAt(0),
      user.last_name?.charAt(0),
    ]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "U";

  const isActive = (href: string) => {
    if (href === config.home) {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();

      toast.success("Déconnexion réussie");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion :",
        error
      );

      toast.error(
        "Une erreur inattendue s'est produite"
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* En-tête mobile */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-primary px-4 lg:hidden">
        <Link
          href={config.home}
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="CCAPAC"
            width={120}
            height={60}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
          className="rounded-lg p-2 transition-colors hover:bg-muted"
          aria-label={
            mobileMenuOpen
              ? "Fermer le menu"
              : "Ouvrir le menu"
          }
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </header>

      {/* Fond mobile */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Fermer le menu"
        />
      )}

      {/* Sidebar universelle */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-primary transition-transform duration-300 lg:static lg:translate-x-0",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        {/* Logo desktop */}
        <div className="hidden h-20 items-center border-b px-6 lg:flex">
          <Link
            href={config.home}
            className="block"
          >
            <Image
              src="/logo.png"
              alt="CCAPAC"
              width={160}
              height={80}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* En-tête mobile sidebar */}
        <div className="flex h-16 items-center border-b px-6 lg:hidden">
          <span className="text-lg font-semibold">
            Menu
          </span>
        </div>

        {/* Nom du dashboard */}
        <div className="border-b px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">
            {config.name}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {config.menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200",
                  active
                    ? "bg-muted text-foreground"
                    : "text-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon size={18} />

                  {typeof item.badge ===
                    "number" &&
                    item.badge > 0 && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {item.badge > 9
                          ? "9+"
                          : item.badge}
                      </span>
                    )}
                </div>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Utilisateur et déconnexion */}
        <div className="border-t bg-muted/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {fullName}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>

              <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                {config.shortName}
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleLogout}
            variant="ghost"
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut size={18} />
            )}

            <span>
              {isLoggingOut
                ? "Déconnexion..."
                : "Déconnexion"}
            </span>
          </Button>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="mx-auto max-w-7xl p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}