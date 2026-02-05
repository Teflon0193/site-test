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
    <nav className="hidden lg:flex items-center space-x-2 md:space-x-3 lg:space-x-6 xl:space-x-8 justify-center flex-1 max-w-3xl md:max-w-4xl lg:max-w-5xl mx-2 md:mx-4">
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
