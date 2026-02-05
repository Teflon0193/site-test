import MainLayout from "@/app/components/layouts/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { FaGlobe, FaPeopleGroup, FaBookOpen } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import { MdFlashOn } from "react-icons/md";

export default function GrandTambourPresentation() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/grand-tambour.jpg"
            alt="Présentation CCAPAC"
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          {/* Gradient for text readability, but sharper */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-28">
          <span className="inline-block mb-6 px-4 py-1.5 bg-white text-black text-xs font-black tracking-[0.2em] uppercase transform -skew-x-6 border border-white hover:bg-black hover:text-white transition-colors duration-300 backdrop-blur-sm">
            GRAND TAMBOUR
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
            Centre Culturel et Artistique pour les Pays d&apos;Afrique Centrale
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-accent"></div>
            <div className="h-[2px] w-12 bg-accent"></div>
          </div>
          <p className="text-xl  text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            Un centre culturel d&apos;excellence dédié à la promotion des arts
            et des cultures d&apos;Afrique centrale.
          </p>
        </div>
      </section>

      {/* Section Missions */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 border-l-4 border-black pl-6">
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 block">
                Notre Raison d&apos;Être
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                Nos Missions
              </h2>
              <p className="text-xl md:text-xl font-medium max-w-2xl leading-relaxed">
                Le Grand Tambour a pour mission de promouvoir et préserver la
                richesse culturelle africaine à travers cinq piliers
                fondamentaux.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
              {[
                {
                  id: "01",
                  text: "Créer, diffuser et préserver les arts congolais et africains",
                },
                {
                  id: "02",
                  text: "Promouvoir l'innovation artistique et culturelle",
                },
                {
                  id: "03",
                  text: "Encourager la participation citoyenne à la culture",
                },
                {
                  id: "04",
                  text: "Faciliter le dialogue interculturel et international",
                },
                {
                  id: "05",
                  text: "Être un moteur de développement social, économique et éducatif",
                  colSpan: "md:col-span-2 lg:col-span-2",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`group p-8 border-b border-r border-black hover:bg-primary hover:text-white transition-colors duration-300 ${item.colSpan || ""}`}
                >
                  <span className="block text-5xl font-black opacity-10 mb-6 group-hover:opacity-100 group-hover:text-white transition-all duration-300">
                    {item.id}
                  </span>
                  <p className="text-lg md:text-xl font-bold leading-tight">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="py-24 bg-white text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/20 pb-8">
              <div>
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-accent mb-2 block">
                  Nos Principes
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
                  Nos Valeurs
                </h2>
              </div>
              <p className="text-black/60 max-w-md text-right hidden md:block">
                Les piliers éthiques qui guident chacune de nos actions et
                décisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: HiLightBulb,
                  title: "Créativité",
                  desc: "Valorisation des formes d'expressions artistiques locales et panafricaines",
                },
                {
                  icon: MdFlashOn,
                  title: "Innovation",
                  desc: "Ouverture aux technologies et nouveaux modes de diffusion",
                },
                {
                  icon: FaBookOpen,
                  title: "Transmission",
                  desc: "Pédagogie, archives, mémoire collective",
                },
                {
                  icon: FaPeopleGroup,
                  title: "Citoyenneté",
                  desc: "Culture comme vecteur de cohésion nationale",
                },
                {
                  icon: FaGlobe,
                  title: "Dialogue",
                  desc: "Plateforme d'échanges panafricains et internationaux",
                  colSpan:
                    "md:col-span-2 lg:col-span-4 lg:w-1/2 lg:mx-auto text-center",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`group p-6 border border-black/40 hover:border-accent hover:bg-white/5 transition-all duration-300 ${item.colSpan || ""}`}
                >
                  <div className="mb-6">
                    <item.icon className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-black uppercase mb-4 tracking-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-black/60 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Historique */}
      <section className="py-24 bg-accent text-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/3">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-md">
                Notre
                <br />
                Histoire
              </h2>
              <div className="h-2 w-24 bg-black mt-4"></div>
            </div>
            <div className="md:w-2/3">
              <div className="bg-white p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                <p className="text-lg md:text-xl font-bold leading-relaxed mb-6">
                  Projet phare initié par le gouvernement congolais, le Grand
                  Tambour est né d&apos;une volonté de doter le pays d&apos;un
                  espace emblématique pour la mémoire vivante.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-zinc-700">
                  Ce centre culturel représente un tournant majeur dans le
                  paysage culturel africain, offrant aux artistes et aux
                  citoyens un lieu de rencontre, de création et de célébration
                  de la richesse culturelle du continent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Symbolique architectural */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-black">
              {/* Image Side */}
              <div className="relative h-[400px] lg:h-auto border-b-2 lg:border-b-0 lg:border-r-2 border-black group overflow-hidden">
                <div className="absolute inset-0 bg-accent/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500" />
                <Image
                  src="/images/grand-tambour2.jpg"
                  alt="Architecture du Grand Tambour"
                  fill
                  className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Text Side */}
              <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-zinc-50">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-accent mb-4 block">
                  Symbolique Architecturale
                </span>
                <h3 className="text-3xl md:text-4xl font-black uppercase mb-8 leading-tight">
                  Le Tambour : <br />
                  Symbole de Mémoire et de Souveraineté
                </h3>
                <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                  Le Grand Tambour est un instrument ancestral et vital pour les
                  peuples de la RDC. Qualifié de «voix collective du peuple», il
                  est un messager, un instrument de rassemblement et un
                  éveilleur de conscience. Sa forme circulaire symbolise
                  l&apos;égalité et incarne la tradition qui doit guider la
                  modernité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-24 bg-primary text-white border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8">
              Découvrez le Grand Tambour
            </h2>
            <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
              Venez vivre l&apos;expérience unique et plongez au cœur de la
              culture africaine.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Link
                href="/grand-tambour/espaces"
                className="w-full md:w-auto px-8 py-4 bg-white text-black text-sm font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-colors duration-300"
              >
                Découvrir les espaces
              </Link>
              <Link
                href="/infos"
                className="w-full md:w-auto px-8 py-4 border border-white text-white text-sm font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Infos pratiques
              </Link>
              <Link
                href="/agenda"
                className="w-full md:w-auto px-8 py-4 border border-zinc-700 text-zinc-300 text-sm font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors duration-300"
              >
                Voir l&apos;agenda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
