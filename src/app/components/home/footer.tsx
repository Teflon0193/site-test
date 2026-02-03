import { SOCIAL_LINKS } from "@/lib/header/constants";
import Link from "next/link";

export default function Footer() {
  const navigation = [
    { label: "Accueil", href: "/" },
    { label: "Programmes", href: "/programmes" },
    { label: "Agenda", href: "/agenda" },
    { label: "Infos pratiques", href: "/infos" },
  ];

  return (
    <footer className="bg-black text-white py-16 sm:py-24 border-t border-white/5">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 mb-16">
          {/* IDENTITÉ */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
              CCAPAC
              <span className="block text-xs tracking-[0.3em] mt-2 text-accent">
                GRAND TAMBOUR
              </span>
            </h2>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs">
              Centre Culturel et Artistique pour les Pays d&apos;Afrique
              Centrale. Un hub d&apos;excellence pour la création contemporaine.
            </p>
          </div>

          {/* LIENS */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
              Navigation
            </h4>
            <nav className="grid grid-cols-1 gap-y-4">
              {navigation.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-black uppercase tracking-widest hover:text-accent transition-all duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
              Contact
            </h4>
            <div className="space-y-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
              <p className="hover:text-white transition-colors">
                Boulevard Triomphal, Kinshasa
              </p>
              <p className="hover:text-white transition-colors">
                +243 995 505 050
              </p>
              <p className="hover:text-white transition-colors">
                info@centreculturel.cd
              </p>
            </div>
          </div>
        </div>

        {/* BAS DE PAGE */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <p>© {new Date().getFullYear()} CCAPAC — TOUS DROITS RÉSERVÉS</p>
            <div className="flex gap-6">
              <Link
                href="/confidentialite"
                className="hover:text-white transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/mentions-legales"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </Link>
              <span>
                PAR{" "}
                <a
                  href="https://gofreelancerdc.com"
                  target="_blank"
                  className="hover:text-white transition-colors underline decoration-zinc-800 underline-offset-4"
                >
                  GOFREELANCE
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
