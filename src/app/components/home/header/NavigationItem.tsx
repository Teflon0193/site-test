import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { DropdownMenu } from "./DropdownMenu";
import type { MenuItem, SubmenuItem } from "@/lib/header/types";

interface NavigationItemProps {
  item: MenuItem;
  isActive: boolean;
  isDropdownOpen: boolean;
  onDropdownEnter: () => void;
  onDropdownLeave: () => void;
  isSubmenuItemActive: (subItem: SubmenuItem, item: MenuItem) => boolean;
}

export function NavigationItem({
  item,
  isActive,
  isDropdownOpen,
  onDropdownEnter,
  onDropdownLeave,
  isSubmenuItemActive,
}: NavigationItemProps) {
  if (item.submenu) {
    return (
      <div
        className="relative group"
        onMouseEnter={onDropdownEnter}
        onMouseLeave={onDropdownLeave}
      >
        <div className="flex items-center gap-1 cursor-pointer py-2">
          <span
            className={`font-bold uppercase transition-all duration-300 text-xs md:text-sm whitespace-nowrap flex items-center px-2 md:px-3 py-2 rounded-lg ${
              isActive
                ? "text-foreground bg-white/10 border-b-2 border-foreground pb-1 shadow-lg"
                : "text-white hover:text-secondary hover:bg-white/5"
            }`}
          >
            {item.title}
            <FaChevronDown
              className={`ml-2 w-3 h-3 transition-all duration-300 group-hover:rotate-180 ${
                isActive ? "text-foreground" : "text-white"
              }`}
            />
          </span>
        </div>

        <DropdownMenu
          item={item}
          isOpen={isDropdownOpen}
          onClose={onDropdownLeave}
          isSubmenuItemActive={isSubmenuItemActive}
        />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`font-bold uppercase transition-all duration-300 text-xs md:text-sm py-2 px-2 md:px-3 rounded-lg block whitespace-nowrap ${
        isActive
          ? "text-foreground bg-white/10 border-b-2 border-foreground pb-1 shadow-lg"
          : "text-white hover:text-secondary hover:bg-white/5"
      }`}
    >
      {item.title}
    </Link>
  );
}
