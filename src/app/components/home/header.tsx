"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedinIn,
  FaChevronDown,
  FaUser,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BiMenu } from "react-icons/bi";
import MobileMenu from "./mobile-menu";

type SubmenuItem = {
  name: string;
  href: string;
};

type MenuItem = {
  title: string;
  href: string;
  submenu?: SubmenuItem[];
};

type SocialLink = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

export const menuItems: MenuItem[] = [
  {
    title: "Grand Tambour",
    href: "/grand-tambour",
    submenu: [
      { name: "Présentation", href: "/grand-tambour/presentation" },
      { name: "Espaces", href: "/grand-tambour/espaces" },
      {
        name: "Équipe & Gouvernance",
        href: "/grand-tambour/equipe-gouvernance",
      },
    ],
  },
  {
    title: "Programmes",
    href: "/programmes",
  },
  {
    title: "Agenda",
    href: "/agenda",
  },
  {
    title: "Médias",
    href: "/media",
  },
  {
    title: "Infos pratiques",
    href: "/infos",
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://web.facebook.com/centrecapac",
    icon: FaFacebook,
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/centrecapac/",
    icon: FaLinkedinIn,
    label: "LinkedIn",
  },
  {
    href: "https://www.twitter.com/centrecapac/",
    icon: FaXTwitter,
    label: "Twitter",
  },
  {
    href: "https://www.instagram.com/centrecapac/",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@Centrecapac",
    icon: FaYoutube,
    label: "YouTube",
  },
  {
    href: "https://www.tiktok.com/@centreculturelaac",
    icon: FaTiktok,
    label: "Tiktok",
  },
];

export default function Header() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMenuItemActive = (item: MenuItem): boolean => {
    if (pathname === "/") return false;
    if (
      item.href === "/agenda" &&
      (pathname.startsWith("/evenement") || pathname === "/agenda")
    ) {
      return true;
    }
    return pathname.startsWith(item.href);
  };

  const isSubmenuItemActive = (subItem: string, item: MenuItem): boolean =>
    pathname === item.href;

  const handleDropdownEnter = (title: string) => setActiveDropdown(title);
  const handleDropdownLeave = () =>
    setTimeout(() => setActiveDropdown(null), 200);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        {/* Social Bar */}
        <div className="hidden sm:block bg-secondary py-2 border-b border-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
            <div className="flex items-center space-x-4">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white hover:text-primary/70 cursor-pointer transition-all duration-200" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div
          className={`bg-primary text-white transition-all duration-300 ${
            isScrolled ? "h-16 md:h-20" : "h-20 md:h-24"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className={`flex items-center transition-all duration-300 ${
                  pathname === "/" ? "scale-105" : "hover:scale-105"
                }`}
              >
                <Image
                  src="/logo.png"
                  alt="Logo Grand Tambour"
                  width={100}
                  height={100}
                  className="w-auto h-10 sm:h-12 md:h-16 lg:h-12 transition-all duration-300 drop-shadow-lg"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 justify-center flex-1 max-w-4xl mx-4">
              {menuItems.map((item) => {
                const isActive = isMenuItemActive(item);

                if (item.submenu) {
                  return (
                    <div
                      key={item.title}
                      className="relative group"
                      onMouseEnter={() => handleDropdownEnter(item.title)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="flex items-center gap-1 cursor-pointer py-2">
                        <span
                          className={`font-bold uppercase transition-all duration-300 text-sm whitespace-nowrap flex items-center px-3 py-2 rounded-lg ${
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

                      {activeDropdown === item.title && (
                        <div
                          className="absolute top-full left-0 pt-2 z-20"
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="h-2 w-full" />
                          <div className="w-72 rounded-2xl bg-gradient-to-br from-white to-muted/10 shadow-2xl py-4 border border-muted/20 backdrop-blur-sm">
                            {item.submenu.map((subItem) => {
                              const isSubActive = isSubmenuItemActive(
                                subItem.name,
                                item
                              );
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`block px-6 py-3 transition-all duration-300 text-sm font-semibold border-l-4 rounded-r-xl mx-2 ${
                                    isSubActive
                                      ? "bg-gradient-to-r from-primary/10 to-primary/20 text-foreground border-primary font-bold shadow-lg"
                                      : "text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-foreground/90 border-transparent hover:border-primary/30 hover:shadow-md"
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`font-bold uppercase transition-all duration-300 text-sm py-2 px-3 rounded-lg block whitespace-nowrap ${
                      isActive
                        ? "text-foreground bg-white/10 border-b-2 border-foreground pb-1 shadow-lg"
                        : "text-white hover:text-secondary hover:bg-white/5"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Desktop Member Button */}
              <Link
                href="/espace-membre"
                className="hidden rounded-xl lg:flex items-center space-x-2 bg-gradient-to-r from-accent to-accent/90 text-black px-4 py-2 font-bold text-sm hover:from-accent/90 hover:to-accent hover:text-black transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <FaUser className="w-4 h-4" />
                <span className="hidden xl:inline">Espace Membres</span>
                <span className="xl:hidden">Membres</span>
              </Link>

              {/* Tablet Member Button */}
              <Link
                href="/espace-membre"
                className="hidden md:flex lg:hidden items-center justify-center bg-gradient-to-r from-white to-muted/10 text-foreground p-2 font-bold hover:from-secondary/90 hover:to-secondary/80 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg rounded-xl"
              >
                <FaUser className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <BiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
