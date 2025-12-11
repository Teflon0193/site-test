import Link from "next/link";
import type { User } from "@prisma/client";

interface MemberButtonProps {
  user: User | null;
}

export function MemberButton({ user }: MemberButtonProps) {
  return (
    <Link
      href={user ? "/espace-membre" : "/auth/login"}
      className="rounded-lg sm:rounded-lg flex items-center justify-center space-x-1.5 sm:space-x-2 bg-gradient-to-r from-accent to-accent/90 text-black px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 font-bold text-[11px] sm:text-xs md:text-sm hover:from-accent/90 hover:to-accent hover:text-black transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
    >
      <span className="hidden sm:inline">
        {user ? "Espace Membre" : "Se connecter"}
      </span>
      <span className="sm:hidden">{user ? "Espace Membre" : "Connexion"}</span>
    </Link>
  );
}
