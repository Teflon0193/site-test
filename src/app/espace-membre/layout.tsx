import type React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import DashboardLayoutClient from "./DashboardLayoutClient";
import PendingApproval from "./PendingApproval";

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

  // Si l'utilisateur n'est pas approuvé, afficher la page d'attente
  if (!user.isApproved) {
    return <PendingApproval userName={user.name} userEmail={user.email} />;
  }

  // Passer l'utilisateur au layout client pour adapter la navigation
  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
