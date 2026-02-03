import Link from "next/link";
import Image from "next/image";
import MainLayout from "../components/layouts/MainLayout";
import { categories } from "@/lib/programmes-data";
import { FaArrowRight } from "react-icons/fa";

export default function ProgrammesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/media/visit2.jpg"
            alt="Programmes CCAPAC"
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
            Découverte & Formation
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
            Nos Programmes
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-accent"></div>
            <div className="h-[2px] w-12 bg-accent"></div>
          </div>
          <p className="text-xl sm:text-2xl text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            Explorez notre offre culturelle et éducative, conçue pour inspirer
            et former les talents de demain.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t-2 border-l-2 border-black">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/programmes/${category.id}`}
                className="group relative h-[400px] sm:h-[500px] overflow-hidden block bg-zinc-900 border-r-2 border-b-2 border-black"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-40"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />

                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-white text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="w-10 h-10 bg-white text-black flex items-center justify-center transform -translate-y-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <FaArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-[0.9] uppercase tracking-tighter">
                      {category.title}
                    </h2>
                    <p className="text-white/80 text-lg font-light leading-relaxed max-w-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-4 bg-primary text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <span className="text-6xl absolute -top-8 -left-8 text-accent opacity-50 font-serif">
              &quot;
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-white">
              La culture est ce qui reste quand on a tout oublié.
            </p>
            <span className="text-6xl absolute -bottom-12 -right-8 text-accent opacity-50 font-serif">
              &quot;
            </span>
          </div>

          <div className="w-24 h-2 bg-accent mx-auto"></div>

          <div className="pt-8">
            <Link
              href="/contact"
              className="inline-block px-12 py-5 bg-white text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Rejoindre l&apos;aventure
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
