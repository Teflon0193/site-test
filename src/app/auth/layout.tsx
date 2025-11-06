import type React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";

export default async function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Si l'utilisateur est déjà connecté, rediriger vers son espace
  if (user) {
    if (user.role === "ADMIN") {
      redirect("/espace-membre/admin");
    } else {
      redirect("/espace-membre");
    }
  }

  // Si non connecté, afficher la page d'auth (login/signup)
  return <>{children}</>;
}
