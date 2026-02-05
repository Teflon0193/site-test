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
    title: "Newsletter",
    href: "/newsletter",
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
    href: "https://www.instagram.com/grandtambour/",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/@Centrecapac2",
    icon: FaYoutube,
    label: "YouTube",
  },
  {
    href: "https://www.tiktok.com/@centrecapac",
    icon: FaTiktok,
    label: "Tiktok",
  },
];
