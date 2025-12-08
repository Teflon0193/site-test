import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/lib/header/constants";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const navigation = [
    { label: "Accueil", href: "/" },
    { label: "Programmes", href: "/programmes" },
    { label: "Agenda", href: "/agenda" },
    { label: "Infos pratiques", href: "/infos" },
  ];

  const programmes = [
    {
      label: "Musique & Arts vivants",
      href: "/programmes/musique-arts-vivants",
    },
    {
      label: "Théâtre & Arts de la scène",
      href: "/programmes/theatre-arts-scene",
    },
    { label: "Cinéma & Audiovisuel", href: "/programmes/cinema-audiovisuel" },
    { label: "Littérature & Pensée", href: "/programmes/litterature-pensee" },
  ];

  const legalLinks = [
    { label: "Politique de confidentialité", href: "#" },
    { label: "Mentions légales", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={300}
                height={100}
                className="h-12 sm:h-16 lg:h-16 w-auto drop-shadow-lg"
              />
            </div>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed mb-4 sm:mb-6 text-white">
              Centre Culturel et Artistique pour les pays d&apos;Afrique
              Centrale.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {SOCIAL_LINKS.map((social) => {
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 sm:w-8 sm:h-8 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center hover:from-secondary hover:to-secondary/80 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    aria-label={social.label}
                  >
                    <social.icon className="sm:w-6 sm:h-6" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white drop-shadow-sm">
              Navigation
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base opacity-90 hover:opacity-100 hover:text-white transition-all duration-300 hover:translate-x-1 block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white drop-shadow-sm">
              Programmes
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {programmes.map((program) => (
                <li key={program.label}>
                  <Link
                    href={program.href}
                    className="text-sm sm:text-base opacity-90 hover:opacity-100 hover:text-white transition-all duration-300 hover:translate-x-1 block py-1"
                  >
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white drop-shadow-sm">
              Contact
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                  <FaMapMarkerAlt size={16} className="text-white" />
                </div>
                <div className="text-sm sm:text-base opacity-90">
                  <p className="font-medium">Boulevard Triomphal</p>
                  <p>Kinshasa, République Démocratique du Congo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                  <FaPhone size={16} className="text-white" />
                </div>
                <p className="text-sm sm:text-base opacity-90 font-medium">
                  +243 995 505 050
                </p>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                  <FaEnvelope size={16} className="text-white" />
                </div>
                <p className="text-sm sm:text-base opacity-90 font-medium break-all">
                  info@centreculturel.cd
                </p>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all duration-300">
                <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
                  <FaClock size={16} className="text-white" />
                </div>
                <div className="text-sm sm:text-base opacity-90">
                  <p className="font-medium">Lun - Ven: 8h - 16h</p>
                  <p className="font-medium">Sam: 13h - 17h</p>
                  <p className="font-medium">Dim: 15h - 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 bg-gradient-to-r from-primary/50 to-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <p className="text-xs sm:text-sm opacity-80 text-center md:text-left">
              © {new Date().getFullYear()} Centre Culturel et Artistique pour
              les pays d&apos;Afrique Centrale. Tous droits réservés.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              {legalLinks.map((legal) => (
                <Link
                  key={legal.label}
                  href={legal.href}
                  className="text-xs sm:text-sm opacity-80 hover:opacity-100 hover:text-white transition-all duration-300 hover:underline"
                >
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
