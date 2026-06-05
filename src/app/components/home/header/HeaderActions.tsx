import { MemberButton } from "./MemberButton";
import { MobileMenuToggle } from "./MobileMenuToggle";
import type { User } from "@prisma/client";

interface HeaderActionsProps {
  user: User | null;
  onMobileMenuToggle: () => void;
}

export function HeaderActions({
  user,
  onMobileMenuToggle,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 flex-shrink-0">
      <a
        href="https://fanzone.centreculturel.cd"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 rounded-xl bg-accent text-black px-4 py-2 font-bold text-sm hover:bg-accent/80 transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
      >
        FanZone
      </a>
      <MemberButton user={user} />
      <MobileMenuToggle onToggle={onMobileMenuToggle} />
    </div>
  );
}
