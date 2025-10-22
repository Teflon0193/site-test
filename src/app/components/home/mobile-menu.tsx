"use client";

import { FaChevronDown, FaUser } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "./header";
import { FaXTwitter } from "react-icons/fa6";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-br from-white to-muted/10 shadow-2xl z-50 transform transition-all duration-300 ease-in-out border-l border-muted/20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-primary via-primary/95 to-primary/90 border-muted/20">
          <div className="flex items-center">
            <div className="flex items-center justify-center mr-3">
              <Image
                src="/animated.png"
                alt="Logo Grand Tambour"
                width={100}
                height={100}
                className="w-auto h-10 sm:h-12 transition-all duration-300 drop-shadow-lg"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <BiX className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 sm:px-6 space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-muted/20 last:border-b-0 pb-2 last:pb-0"
              >
                {item.submenu ? (
                  <div>
                    <button
                      className="w-full text-left uppercase font-bold text-foreground py-3 px-3 rounded-xl flex items-center justify-between hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.title ? null : item.title
                        )
                      }
                    >
                      {item.title}
                      <FaChevronDown
                        className={`w-3 h-3 transition-all duration-300 ${
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
                      <div className="pl-4 space-y-1 pb-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block py-2 text-sm uppercase text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 rounded-xl px-3 transition-all duration-300 font-semibold"
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
                    className="block font-bold uppercase text-foreground py-3 px-3 rounded-xl hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300"
                    onClick={handleLinkClick}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Espace Membres Button */}
          <div className="px-4 sm:px-6 mt-6">
            <Link
              href="/espace-membre"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-accent to-accent/90 cursor-pointer text-black px-4 py-3 font-bold text-sm hover:from-accent/90 hover:to-accent hover:text-black transition-all duration-300 hover:scale-105 shadow-lg rounded-xl"
            >
              <FaUser className="w-4 h-4" />
              <span>Espace Membres</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-muted/20 bg-gradient-to-r from-muted/5 to-muted/10">
          <div className="flex justify-center space-x-4 text-foreground">
            <a
              href="https://web.facebook.com/centrecapac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 hover:scale-110"
            >
              <FaFacebook className="w-5 h-5 text-foreground hover:text-primary/70 cursor-pointer transition-all duration-200" />
            </a>
            <a
              href="https://www.twitter.com/centrecapac/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 hover:scale-110"
            >
              <FaXTwitter className="w-5 h-5 text-foreground hover:text-primary/70 cursor-pointer transition-all duration-200" />
            </a>
            <a
              href="https://www.instagram.com/centrecapac/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 hover:scale-110"
            >
              <FaInstagram className="w-5 h-5 text-foreground hover:text-primary/70 cursor-pointer transition-all duration-200" />
            </a>
            <a
              href="https://www.youtube.com/@Centrecapac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 hover:scale-110"
            >
              <FaYoutube className="w-5 h-5 text-foreground hover:text-primary/70 cursor-pointer transition-all duration-200" />
            </a>
            <a
              href="https://www.tiktok.com/@centreculturelaac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tiktok"
              className="p-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all duration-300 hover:scale-110"
            >
              <FaTiktok className="w-5 h-5 text-foreground hover:text-primary/70 cursor-pointer transition-all duration-200" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
