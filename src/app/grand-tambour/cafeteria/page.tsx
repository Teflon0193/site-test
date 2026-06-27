import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Clock,
  CookingPot,
  Download,
  Globe,
  Images,
  Leaf,
  MapPin,
  PhoneCall,
  Smartphone,
  Truck,
  Users,
  Utensils,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import MainLayout from "@/app/components/layouts/MainLayout";
import CafeteriaMenu from "./CafeteriaMenu";
import CafeteriaGallery from "./CafeteriaGallery";

export const metadata: Metadata = {
  title: "La Cafétéria — Grand Tambour | CCAPAC",
  description:
    "La Cafétéria du CCAPAC : un espace convivial où la gastronomie d'Afrique centrale rencontre la culture. Cuisine locale, produits frais, cadre inspirant.",
};

const aboutFeatures = [
  { icon: Leaf, title: "Produits frais", detail: "Sourcing local quotidien" },
  { icon: Utensils, title: "Cuisine locale", detail: "Recettes ancestrales" },
  { icon: Globe, title: "International", detail: "Fusion de saveurs" },
  { icon: CalendarCheck, title: "7j / 7", detail: "8h00 - 22h00" },
];

const specialities = [
  {
    title: "Cuisine Congolaise",
    description:
      "Le goût authentique du pays. Poulet Moambe servi avec fufu et pondu frais.",
    price: "À partir de 15 000 FC",
    image: "/images/plats/1.jpg",
    badge: "Populaire",
  },
  {
    title: "Grillades & Liboke",
    description:
      "Saveurs fumées et épices locales. Poisson capitaine en papillote traditionnelle.",
    price: "À partir de 20 000 FC",
    image: "/images/plats/3.webp",
  },
  {
    title: "Boissons & Cafés",
    description:
      "Jus tropicaux frais et café artisan. Sélection de thés et infusions locales.",
    price: "À partir de 5 000 FC",
    image: "/images/plats/3.jpg",
  },
];

const whyChooseUs = [
  {
    icon: CookingPot,
    title: "Cuisine fraîche",
    detail:
      "Tous nos ingrédients sont sélectionnés le matin même sur les marchés locaux.",
  },
  {
    icon: Truck,
    title: "Produits locaux",
    detail:
      "Nous soutenons les agriculteurs et producteurs artisanaux de la région.",
  },
  {
    icon: Award,
    title: "Chef expérimenté",
    detail:
      "Notre équipe culinaire possède une expertise internationale et locale.",
  },
  {
    icon: Images,
    title: "Cadre agréable",
    detail:
      "Une architecture moderne intégrant des éléments culturels vibrants.",
  },
  {
    icon: Wifi,
    title: "WiFi gratuit",
    detail:
      "Idéal pour vos rendez-vous d'affaires ou vos sessions de travail créatives.",
  },
  {
    icon: Smartphone,
    title: "Paiement mobile",
    detail:
      "Nous acceptons les méthodes de paiement modernes (M-Pesa, Orange Money, etc.).",
  },
];

export default function CafeteriaPage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cafeteria/cafe_hero.jpeg"
            alt="La Cafétéria du CCAPAC"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#25150e]/90 via-[#25150e]/65 to-[#25150e]/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-40 pb-16 text-white sm:px-6 sm:pt-48 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-6 inline-block rounded-full bg-[#ffcc02] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#3a2014]">
              Gastronomie &amp; Culture
            </span>
            <h1 className="text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              La Cafétéria du CCAPAC
            </h1>
            <p className="mt-5 text-lg font-semibold text-[#ffcc02]">
              Un espace convivial où la gastronomie rencontre la culture.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Découvrez un espace chaleureux où visiteurs, artistes, familles et
              professionnels partagent un repas dans une ambiance conviviale
              inspirée par l&apos;héritage d&apos;Afrique centrale.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="#menu"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary/90 active:scale-[0.98]"
              >
                Voir le menu
                <UtensilsCrossed className="h-4 w-4" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                Réserver une table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="absolute -left-6 -top-6 -z-10 h-40 w-40 rounded-full bg-[#f4efe4]" />
              <Image
                src="/images/cafeteria/cafetaria_espce.jpg"
                alt="L'espace de la Cafétéria"
                width={720}
                height={720}
                className="aspect-square w-full rounded-2xl border border-[#eadcc7] object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -right-2 max-w-xs rounded-xl border border-[#eadcc7] bg-white/90 p-6 shadow-xl backdrop-blur sm:-right-6">
                <p className="text-sm font-semibold italic text-primary">
                  &laquo; Nous fusionnons les traditions locales avec le
                  raffinement international pour créer une expérience unique.
                  &raquo;
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-secondary">
                  — Chef de cuisine
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                La Cafétéria
              </p>
              <h2 className="mt-2 text-3xl font-bold uppercase leading-tight text-primary sm:text-4xl">
                Une expérience culinaire unique
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-primary/70 sm:text-base">
                <p>
                  Au cœur du Centre Culturel, notre cafétéria n&apos;est pas
                  seulement un lieu de restauration : c&apos;est une extension de
                  l&apos;expérience artistique. Nous privilégions les circuits
                  courts et les saveurs authentiques du Bassin du Congo.
                </p>
                <p>
                  Chaque plat est une célébration de notre patrimoine, préparé
                  avec une attention méticuleuse et une passion pour
                  l&apos;excellence gastronomique.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {aboutFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-center gap-4 rounded-xl bg-[#f4efe4] p-4"
                    >
                      <Icon className="h-9 w-9 flex-none text-secondary" />
                      <div>
                        <p className="font-bold text-primary">
                          {feature.title}
                        </p>
                        <p className="text-sm italic text-primary/60">
                          {feature.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spécialités */}
      <section className="bg-[#f4efe4] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold uppercase text-primary sm:text-4xl">
              Nos spécialités
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary/70 sm:text-base">
              Une sélection des incontournables de notre carte, mettant à
              l&apos;honneur les trésors du terroir congolais.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {specialities.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-[#eadcc7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  {item.badge && (
                    <span className="absolute right-4 top-4 rounded-lg bg-[#ffcc02] px-3 py-1 text-sm font-bold text-[#3a2014]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold uppercase text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary/65">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#eadcc7] pt-6">
                    <span className="text-lg font-bold text-secondary">
                      {item.price}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4efe4] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carte du jour */}
      <section id="menu" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold uppercase text-primary sm:text-4xl">
              La carte du jour
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary/70 sm:text-base">
              Une carte qui évolue au fil des saisons et des arrivages du marché.
            </p>
          </div>

          <CafeteriaMenu />

          <div className="mt-16 text-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border-b-2 border-primary pb-1 font-bold uppercase tracking-wide text-primary transition-all hover:border-secondary hover:text-secondary"
            >
              Télécharger le menu complet (PDF)
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="overflow-hidden bg-[#f4efe4] py-16 sm:py-24">
        <CafeteriaGallery />
      </section>

      {/* Pourquoi nous choisir */}
      <section className="bg-primary py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold uppercase sm:text-4xl">
              Pourquoi nous choisir ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Plus qu&apos;un restaurant, une destination culturelle
              incontournable à Kinshasa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group flex items-start gap-5">
                  <span className="grid h-14 w-14 flex-none place-items-center rounded-xl bg-white/10 text-[#ffcc02] transition-all duration-300 group-hover:bg-[#ffcc02] group-hover:text-[#3a2014]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold">{feature.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">
                      {feature.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="flex flex-col items-center rounded-2xl border border-[#eadcc7] bg-[#fdfbf6] p-10 text-center">
            <Clock className="mb-5 h-9 w-9 text-secondary" />
            <h4 className="mb-4 text-lg font-bold uppercase text-primary">
              Horaires d&apos;ouverture
            </h4>
            <div className="w-full space-y-2 text-sm text-primary/70">
              <p className="flex justify-between gap-8">
                <span>Lundi - Samedi</span>
                <span className="font-semibold text-primary">08:00 - 22:00</span>
              </p>
              <p className="flex justify-between gap-8">
                <span>Dimanche</span>
                <span className="font-semibold text-primary">10:00 - 20:00</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-[#eadcc7] bg-[#fdfbf6] p-10 text-center">
            <MapPin className="mb-5 h-9 w-9 text-secondary" />
            <h4 className="mb-4 text-lg font-bold uppercase text-primary">
              Nous trouver
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-primary/70">
              Boulevard Triomphal, Kinshasa
              <br />
              En face du Palais du Peuple
            </p>
            <Link
              href="/infos"
              className="text-sm font-bold text-secondary hover:underline"
            >
              Voir sur la carte
            </Link>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-[#eadcc7] bg-[#fdfbf6] p-10 text-center">
            <Users className="mb-5 h-9 w-9 text-secondary" />
            <h4 className="mb-4 text-lg font-bold uppercase text-primary">
              Événements privés
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-primary/70">
              Capacité : jusqu&apos;à 150 personnes.
              <br />
              Parking sécurisé et gratuit.
            </p>
            <a
              href="mailto:info@centreculturel.cd?subject=Demande%20de%20devis%20-%20Cafétéria"
              className="text-sm font-bold text-secondary hover:underline"
            >
              Demander un devis
            </a>
          </div>
        </div>
      </section>

      {/* Réservation CTA */}
      <section id="contact" className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-center sm:p-16 md:p-24">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold uppercase text-white sm:text-4xl">
                Réservez votre table dès aujourd&apos;hui
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                Partagez un moment d&apos;exception en famille, entre amis ou pour
                vos affaires. Nous vous garantissons une expérience mémorable.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-5">
                <a
                  href="mailto:info@centreculturel.cd?subject=Réservation%20Cafétéria"
                  className="rounded-lg bg-[#ffcc02] px-10 py-4 text-sm font-bold uppercase tracking-wide text-[#3a2014] shadow-xl transition hover:bg-white active:scale-[0.98]"
                >
                  Réserver
                </a>
                <a
                  href="mailto:info@centreculturel.cd"
                  className="rounded-lg border-2 border-white px-10 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 active:scale-[0.98]"
                >
                  Nous contacter
                </a>
              </div>
              <p className="mt-9 inline-flex items-center justify-center gap-2 text-sm text-white/70">
                <PhoneCall className="h-4 w-4" />
                +243 890 809 746
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
