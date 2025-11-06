import type React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import MemberLayoutClient from "./MemberLayoutClient";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Rediriger si non authentifié
  if (!user) {
    redirect("/auth/login");
  }

  // Rediriger les admins vers leur espace
  if (user.role === "ADMIN") {
    redirect("/espace-membre/admin");
  }

  return <MemberLayoutClient>{children}</MemberLayoutClient>;
}
