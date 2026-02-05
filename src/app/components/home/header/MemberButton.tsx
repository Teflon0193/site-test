import Link from "next/link";
import type { User } from "@prisma/client";

interface MemberButtonProps {
  user: User | null;
}

export function MemberButton({ user }: MemberButtonProps) {
  return (
    <Link
      href={user ? "/espace-membre" : "/auth/login"}
      className="hidden sm:inline-flex items-center justify-center px-6 py-2 bg-accent text-black text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300"
    >
      <span>{user ? "Espace Membre" : "Se connecter"}</span>
    </Link>
  );
}
