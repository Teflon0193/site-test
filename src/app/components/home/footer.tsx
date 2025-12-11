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

  return (
    <footer className="bg-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-auto items-center flex">
                <Image
                  src="/logo.png"
                  alt="CCAPAC Logo"
                  width={180}
                  height={60}
                  className="h-12 w-auto object-contain brightness-0 invert opacity-90"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-white">
              Le Centre Culturel et Artistique pour les pays d&apos;Afrique
              Centrale est un lieu d&apos;échange, de création et de diffusion
              artistique au cœur de Kinshasa.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white cursor-pointer text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Programmes
            </h4>
            <ul className="space-y-3">
              {programmes.map((program) => (
                <li key={program.label}>
                  <Link
                    href={program.href}
                    className="text-sm hover:text-white cursor-pointer text-white transition-colors duration-200"
                  >
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              Contact
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <FaMapMarkerAlt className="w-5 h-5 text-white flex-shrink-0" />
                <span className="leading-relaxed text-white">
                  Boulevard Triomphal
                  <br />
                  Kinshasa, RDC
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <FaPhone className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-white">+243 995 505 050</span>
              </div>
              <div className="flex gap-3 items-center">
                <FaEnvelope className="w-4 h-4 text-white flex-shrink-0" />
                <span className="break-all text-white">
                  info@centreculturel.cd
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <FaClock className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-white">Lun-Ven: 8h-16h</p>
                  <p className="text-white">Sam: 9h-16h</p>
                  <p className="text-white">Dim: 9h-16h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white">
            <p>© {new Date().getFullYear()} CCAPAC. Tous droits réservés.</p>

            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-white">Développé par</span>
              <a
                href="https://gofreelancerdc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-white transition-colors"
              >
                GoFreelance
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
