// src/app/auth/layout.tsx
import type React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // On ne fait RIEN côté serveur. On laisse le client gérer.
  return <>{children}</>;
}