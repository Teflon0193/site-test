"use client";

import { FaChevronDown } from "react-icons/fa";
import { MemberButton } from "./header/MemberButton";
import { SOCIAL_LINKS } from "@/lib/header/constants";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "@/lib/header";
import type { User } from "@prisma/client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLinkClick = () => {
    setOpenDropdown(null);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-[320px] sm:w-80 md:w-96 bg-gradient-to-br from-white to-muted/10 shadow-2xl z-50 transform transition-all duration-300 ease-in-out border-l border-muted/20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b bg-gradient-to-r from-primary via-primary/95 to-primary/90 border-muted/20">
          <div className="flex items-center">
            <div className="flex items-center justify-center mr-2 sm:mr-3">
              <Image
                src="/animated.png"
                alt="Logo Grand Tambour"
                width={100}
                height={100}
                className="w-auto h-8 sm:h-10 md:h-12 transition-all duration-300 drop-shadow-lg"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110"
            aria-label="Fermer le menu"
          >
            <BiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4">
          <nav className="px-3 sm:px-4 md:px-6 space-y-1.5 sm:space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-muted/20 last:border-b-0 pb-1.5 sm:pb-2 last:pb-0"
              >
                {item.submenu ? (
                  <div>
                    <button
                      className="w-full text-left uppercase font-bold text-foreground py-2.5 sm:py-3 px-2.5 sm:px-3 rounded-lg sm:rounded-xl flex items-center justify-between hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 text-sm sm:text-base"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.title ? null : item.title
                        )
                      }
                    >
                      <span className="truncate">{item.title}</span>
                      <FaChevronDown
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 ml-2 transition-all duration-300 ${
                          openDropdown === item.title ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openDropdown === item.title
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-3 sm:pl-4 space-y-1 pb-1.5 sm:pb-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block py-1.5 sm:py-2 text-xs sm:text-sm uppercase text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 rounded-lg sm:rounded-xl px-2.5 sm:px-3 transition-all duration-300 font-semibold"
                            onClick={handleLinkClick}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="block font-bold uppercase text-foreground py-2.5 sm:py-3 px-2.5 sm:px-3 rounded-lg sm:rounded-xl hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 text-sm sm:text-base"
                    onClick={handleLinkClick}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Espace Membres Button */}
          <div className="px-3 sm:px-4 md:px-6 pt-2 sm:pt-3">
            <MemberButton user={user} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 md:p-6 border-t border-muted/20 bg-gradient-to-r from-muted/5 to-muted/10">
          <div className="flex justify-center flex-wrap gap-2 sm:gap-3 md:gap-4 text-foreground">
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 hover:scale-110"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground hover:text-primary/70 cursor-pointer transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
