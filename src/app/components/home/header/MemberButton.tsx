import Link from "next/link";
import type { User } from "@prisma/client";

interface MemberButtonProps {
  user: User | null;
}

/**
 * Member area button component
 * Displays "Mon espace" if user is connected, "Se connecter" otherwise
 */
export function MemberButton({ user }: MemberButtonProps) {
  return (
    <Link
      href={user ? "/espace-membre" : "/auth/login"}
      className="rounded-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-accent to-accent/90 text-black px-4 py-2 font-bold text-sm hover:from-accent/90 hover:to-accent hover:text-black transition-all duration-300 hover:scale-105 shadow-lg"
    >
      <span>{user ? "Mon espace" : "Se connecter"}</span>
    </Link>
  );
}
