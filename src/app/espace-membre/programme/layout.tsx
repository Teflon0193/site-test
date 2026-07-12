"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function ProgrammeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      return;
    }

    if (
      !["PROGRAMME", "ADMIN"].includes(
        user.role
      )
    ) {
      const destinations: Record<
        string,
        string
      > = {
        MEMBER:
          "/espace-membre/membre",

        REGISSEUR_GENERAL:
          "/espace-membre/regisseur",

        DIRECTION_ARTISTIQUE:
          "/espace-membre/direction-artistique",

        COMMUNICATION:
          "/espace-membre/communication",

        JURIDIQUE:
          "/espace-membre/juridique",

        FINANCE:
          "/espace-membre/finance",

        ADMIN:
          "/espace-membre/admin",
      };

      router.replace(
        destinations[user.role] ||
          "/espace-membre"
      );
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="mt-4 text-sm text-muted-foreground">
            Chargement de l&apos;espace Programme...
          </p>
        </div>
      </div>
    );
  }

  if (
    !user ||
    !["PROGRAMME", "ADMIN"].includes(
      user.role
    )
  ) {
    return null;
  }

  return <>{children}</>;
}