import { NavigationItem } from "./NavigationItem";
import { menuItems } from "@/lib/header/constants";
import type { MenuItem, SubmenuItem } from "@/lib/header/types";

interface DesktopNavigationProps {
  isMenuItemActive: (item: MenuItem) => boolean;
  isSubmenuItemActive: (subItem: SubmenuItem, item: MenuItem) => boolean;
  activeDropdown: string | null;
  onDropdownEnter: (title: string) => void;
  onDropdownLeave: () => void;
}

export function DesktopNavigation({
  isMenuItemActive,
  isSubmenuItemActive,
  activeDropdown,
  onDropdownEnter,
  onDropdownLeave,
}: DesktopNavigationProps) {
  return (
    <nav className="hidden lg:flex items-center space-x-12 ml-16 flex-1">
      {menuItems.map((item) => {
        const isActive = isMenuItemActive(item);
        const isDropdownOpen = activeDropdown === item.title;

        return (
          <NavigationItem
            key={item.title}
            item={item}
            isActive={isActive}
            isDropdownOpen={isDropdownOpen}
            onDropdownEnter={() => onDropdownEnter(item.title)}
            onDropdownLeave={onDropdownLeave}
            isSubmenuItemActive={isSubmenuItemActive}
          />
        );
      })}
    </nav>
  );
}
