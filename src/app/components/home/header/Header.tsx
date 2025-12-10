"use client";

import { useState } from "react";
import MobileMenu from "../mobile-menu";
import { SocialBar, Logo, DesktopNavigation, HeaderActions } from "./index";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { useDropdown } from "@/hooks/useDropdown";
import { useActiveMenuItem } from "@/hooks/useActiveMenuItem";
import type { User } from "@prisma/client";

interface MainHeaderProps {
  user: User | null;
}

/**
 * Main Header component (Client Component)
 * Handles scroll detection, dropdown state, and mobile menu state
 */
export default function Header({ user }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollDetection({ threshold: 10 });
  const { activeDropdown, openDropdown, closeDropdownDelayed } = useDropdown();
  const { isMenuItemActive, isSubmenuItemActive } = useActiveMenuItem();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <SocialBar />

        <div
          className={`bg-primary text-white transition-all duration-300 ${
            isScrolled ? "h-16 md:h-20" : "h-20 md:h-24"
          }`}
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-full flex items-center justify-between gap-2 md:gap-4">
            <Logo />

            <DesktopNavigation
              isMenuItemActive={isMenuItemActive}
              isSubmenuItemActive={isSubmenuItemActive}
              activeDropdown={activeDropdown}
              onDropdownEnter={openDropdown}
              onDropdownLeave={closeDropdownDelayed}
            />

            <HeaderActions
              user={user}
              onMobileMenuToggle={handleMobileMenuToggle}
            />
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        user={user}
      />
    </>
  );
}
