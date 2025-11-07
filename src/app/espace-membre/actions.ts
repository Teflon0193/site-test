"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  try {
    const headersList = await headers();

    await auth.api.signOut({
      headers: headersList,
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }

  redirect("/");
}
