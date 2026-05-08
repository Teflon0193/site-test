import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  // Navigation simple et directe
  const navigation = [
    { label: "Accueil", href: "/" },
    { label: "Programmes", href: "/programmes" },
    { label: "Agenda", href: "/agenda" },
    { label: "Infos pratiques", href: "/infos" },
  ];

  // Programmes
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

  // Réseaux sociaux avec icônes
  const socialNetworks = [
    {
      name: "Facebook",
      icon: FaFacebook,
      url: "https://web.facebook.com/centrecapac",
    },
    {
      name: "Twitter",
      icon: FaXTwitter,
      url: "https://www.twitter.com/centrecapac/",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/centrecapac/",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: "https://www.youtube.com/@Centrecapac",
    },
    {
      name: "Tiktok",
      icon: FaTiktok,
      url: "https://www.tiktok.com/@centreculturelaac",
    },
  ];

  // Liens légaux
  const legalLinks = [
    { label: "Politique de confidentialité", href: "#" },
    { label: "Mentions légales", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Logo and description */}
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
              Centre Culturel et Artistique pour les Pays d&apos;Afrique
              Centrale.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialNetworks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 sm:w-10 sm:h-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center hover:from-secondary hover:to-secondary/80 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    aria-label={social.name}
                  >
                    <IconComponent size={18} className="sm:w-5 sm:h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation links */}
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

          {/* Programs */}
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

          {/* Contact info */}
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
                  +243 890 809 746
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
                  <p>Sam: 13h - 17h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20 bg-gradient-to-r from-primary/50 to-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
            <p className="text-xs sm:text-sm opacity-80 text-center md:text-left">
              © {new Date().getFullYear()} Centre Culturel et Artistique pour
              les Pays d&apos;Afrique Centrale. Tous droits réservés.
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
