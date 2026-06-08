import { MemberButton } from "./MemberButton";
import { MobileMenuToggle } from "./MobileMenuToggle";
// import { ArrowUpRight, Sparkles } from "lucide-react";
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
    <div className="flex items-center justify-end gap-2 sm:gap-2.5 xl:w-full xl:pl-5 2xl:pl-6">
      {/* <a
        href="https://fanzone.centreculturel.cd"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-10 items-center gap-1.5 rounded-xl border border-white/30 bg-white/5 px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:border-accent hover:bg-accent hover:text-black sm:px-3.5 sm:text-sm"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        FanZone
        <ArrowUpRight
          className="hidden h-3.5 w-3.5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
          aria-hidden="true"
        />
      </a> */}
      <div className="hidden xl:block">
        <MemberButton user={user} />
      </div>
      <MobileMenuToggle onToggle={onMobileMenuToggle} />
    </div>
  );
}
