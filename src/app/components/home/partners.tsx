import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function PartnersSection() {
  const partners = [
    {
      name: "Orange",
      logo: "/images/partners/orange.png",
    },
    {
      name: "Close The Gap",
      logo: "/logos-1.png",
    },
    {
      name: "Silikin Village",
      logo: "/logo-silikin.png",
    },
    {
      name: "SCPT",
      logo: "/scpt-logo.png",
    },
  ];

  return (
    <section className="py-24 bg-white text-black relative z-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-black/10 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Nos Partenaires
            </h2>
            <p className="text-xl font-serif italic text-black/60 max-w-xl">
              Ils soutiennent notre vision et contribuent au rayonnement de la
              culture.
            </p>
          </div>

          <Link
            href="/infos"
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors"
          >
            <span>Devenir partenaire</span>
            <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid - Museum Style Donor Wall */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-black/10">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group relative h-48 md:h-64 flex items-center justify-center p-8 border-r border-b border-black/10 bg-white hover:bg-black/[0.02] transition-colors duration-500"
            >
              <div className="relative w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100 group-hover:scale-110">
                <Image
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[3px] border-r-[3px] border-accent opacity-0 group-hover:opacity-100 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
