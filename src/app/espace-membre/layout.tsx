import type React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import DashboardLayoutClient from "./DashboardLayoutClient";
import PendingApproval from "./PendingApproval";
import prisma from "@/lib/prisma";

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

  // Récupérer le nombre de demandes en attente (uniquement pour les admins)
  let pendingApprovalsCount = 0;
  if (user.role === "ADMIN") {
    pendingApprovalsCount = await prisma.user.count({
      where: {
        isApproved: false,
        role: "MEMBER",
      },
    });
  }

  // Passer l'utilisateur au layout client pour adapter la navigation
  return (
    <DashboardLayoutClient user={user} pendingApprovalsCount={pendingApprovalsCount}>
      {children}
    </DashboardLayoutClient>
  );
}
