"use client";

import { useState } from "react";
import MobileMenu from "../mobile-menu";
import { Logo, DesktopNavigation, HeaderActions } from "./index";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { useDropdown } from "@/hooks/useDropdown";
import { useActiveMenuItem } from "@/hooks/useActiveMenuItem";
import type { User } from "@prisma/client";

interface MainHeaderProps {
  user?: User | null;
  transparentHeader?: boolean;
}

export default function Header({
  user = null,
  transparentHeader = true,
}: MainHeaderProps) {
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

  const isBackgroundVisible = isScrolled || !transparentHeader;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b ${
          isBackgroundVisible
            ? "bg-primary/95 backdrop-blur-md border-white/10 py-3"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div
            className={`transition-all duration-500 ${isScrolled ? "scale-90" : "scale-100"}`}
          >
            <Logo />
          </div>

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
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        user={user}
      />
    </>
  );
}
