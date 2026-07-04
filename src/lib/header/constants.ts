import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { MenuItem, SocialLink } from "./types";

export const menuItems: MenuItem[] = [
  {
    title: "Grand Tambour",
    href: "/grand-tambour",
    submenu: [
      { name: "Présentation", href: "/grand-tambour/presentation" },
      { name: "Espaces", href: "/grand-tambour/espaces" },
      { name: "La Cafétéria", href: "/grand-tambour/cafeteria" },
      // Temporairement masque pendant la restructuration de l'organigramme.
      // {
      //   name: "Équipe & Gouvernance",
      //   href: "/grand-tambour/equipe-gouvernance",
      // },
    ],
  },
  {
    title: "Action Culturelle",
    href: "/programmes",
  },
  {
    title: "Agenda",
    href: "/agenda",
  },
  {
    title: "Actualités",
    href: "/actualites",
  },
  {
    title: "Articles",
    href: "/articles",
  },
  {
    title: "Galleries",
    href: "/media",
  },
  {
    title: "Infos pratiques",
    href: "/infos",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
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
    href: "https://www.instagram.com/grandtambour?igsh=ZTNqcGQycnlwbGFw&utm_source=qr",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@Centrecapac2",
    icon: FaYoutube,
    label: "YouTube",
  },
  {
    href: "https://www.tiktok.com/@grandtambour?_r=1&_t=ZS-974QRYwlVWn",
    icon: FaTiktok,
    label: "Tiktok",
  },
];
