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
      <MemberButton user={user} />
      <MobileMenuToggle onToggle={onMobileMenuToggle} />
    </div>
  );
}
