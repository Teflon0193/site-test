import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ApprovalsPageClient } from "./ApprovalsPageClient";

export default async function ApprovalsPage() {
  const user = await getUser();

  // Rediriger si non authentifié
  if (!user) {
    redirect("/auth/login");
  }

  // Rediriger les non-admins
  if (user.role !== "ADMIN") {
    redirect("/espace-membre");
  }

  return <ApprovalsPageClient />;
}
