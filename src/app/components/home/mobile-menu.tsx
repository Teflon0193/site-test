"use client";

import { FaChevronDown } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/lib/header/constants";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import Link from "next/link";
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
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-zinc-950 text-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] border-l border-white/10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Background Watermark */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
          <span className="text-[300px] font-black leading-none text-white whitespace-nowrap absolute -top-10 -right-20 rotate-90 origin-top-right">
            MENU
          </span>
        </div>

        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <span className="text-xl font-bold tracking-[0.2em] text-white">
              MENU
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 transition-colors"
              aria-label="Fermer le menu"
            >
              <BiX className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto py-8 px-8">
            <nav className="space-y-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-white/10 pb-6 last:border-0"
                >
                  {item.submenu ? (
                    <div>
                      <button
                        className="w-full text-left uppercase font-black text-3xl sm:text-4xl text-white hover:text-accent transition-colors duration-300 flex items-center justify-between group"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.title ? null : item.title,
                          )
                        }
                      >
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          {item.title}
                        </span>
                        <FaChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            openDropdown === item.title
                              ? "rotate-180 text-accent"
                              : "text-white/50"
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openDropdown === item.title
                            ? "max-h-96 opacity-100 mt-4"
                            : "max-h-0 opacity-0 mt-0"
                        }`}
                      >
                        <div className="space-y-3 pl-4 border-l-2 border-white/10">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block text-sm uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors duration-300"
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
                      className="block font-black text-3xl sm:text-4xl uppercase text-white hover:text-accent transition-colors duration-300 hover:translate-x-2 transform"
                      onClick={handleLinkClick}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="mt-12 space-y-4">
              <Link
                href={user ? "/espace-membre" : "/auth/login"}
                className="block w-full py-4 bg-accent text-black text-center font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors"
                onClick={onClose}
              >
                {user ? "Espace Membre" : "Se connecter"}
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-white/10 bg-black/20">
            <div className="flex gap-6 justify-center">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/50 hover:text-white transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
