import type React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function EspaceMembreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Rediriger si non authentifié
  if (!user) {
    redirect("/auth/login");
  }

  // Passer l'utilisateur au layout client pour adapter la navigation
  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
