import Image from "next/image";
import Link from "next/link";
import { FaHandshake } from "react-icons/fa";

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
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Responsive */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl uppercase sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight drop-shadow-sm">
            Ils nous accompagnent
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Des partenariats stratégiques qui enrichissent notre vision
            culturelle
          </p>
        </div>

        {/* Partners Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex items-center justify-center p-4 sm:p-6 md:p-8 hover:scale-105 transition-all duration-300 rounded-2xl w-full "
            >
              <Image
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                width={200}
                height={200}
                className="object-contain transition-all duration-300 max-h-16 sm:max-h-16 md:max-h-20 lg:max-h-24 w-full group-hover:scale-110"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/infos"
            className="inline-flex rounded-xl text-base items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaHandshake className="w-6 h-6" />
            Devenir partenaire
          </Link>
        </div>
      </div>
    </section>
  );
}
