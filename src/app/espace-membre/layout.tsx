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

  if (!user) {
    redirect("/auth/login");
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
