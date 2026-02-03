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
            className={`font-bold uppercase tracking-[0.2em] transition-all duration-300 text-xs md:text-sm whitespace-nowrap flex items-center py-2 relative group ${
              isActive || isDropdownOpen
                ? "text-white"
                : "text-white hover:text-white"
            }`}
          >
            {item.title}
            <span
              className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive || isDropdownOpen ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
            <FaChevronDown
              className={`ml-2 w-3 h-3 transition-all duration-300 group-hover:rotate-180 ${
                isActive || isDropdownOpen
                  ? "text-white"
                  : "text-white/50 group-hover:text-white"
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
      className={`font-bold uppercase tracking-[0.2em] transition-all duration-300 text-xs md:text-sm py-2 block whitespace-nowrap relative group ${
        isActive ? "text-white" : "text-white hover:text-white"
      }`}
    >
      {item.title}
      <span
        className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      ></span>
    </Link>
  );
}
