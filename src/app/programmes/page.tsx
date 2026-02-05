import Link from "next/link";
import Image from "next/image";
import MainLayout from "../components/layouts/MainLayout";
import { categories } from "@/lib/programmes-data";
import { FaArrowRight } from "react-icons/fa";

export default function ProgrammesPage() {
  return (
    <MainLayout transparentHeader={false}>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px] md:h-[50vh] overflow-hidden border-b-2 border-black bg-white group/hero">
        {/* Slanted Image Suite Background */}
        <div className="absolute inset-0 flex w-[120%] -ml-[10%] z-10">
          <div
            className="relative flex-1 h-full overflow-hidden border-r-2 border-black transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/media/visit2.jpg"
              alt="CCAPAC Programme 1"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 scale-110 group-hover/hero:scale-100"
              priority
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
          <div
            className="relative flex-1 h-full overflow-hidden border-x-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/events/event2.jpg"
              alt="CCAPAC Programme 2"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-75 scale-110 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
          <div
            className="relative flex-1 h-full overflow-hidden border-l-2 border-black -ml-[5%] transition-all duration-700 hover:flex-[1.5]"
            style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" }}
          >
            <Image
              src="/images/media/media3.jpg"
              alt="CCAPAC Programme 3"
              fill
              className="object-cover grayscale group-hover/hero:grayscale-0 transition-all duration-1000 delay-150 scale-110 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/40 group-hover/hero:bg-transparent transition-all duration-700" />
          </div>
        </div>

        {/* Text Overlay & Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:to-white/5 z-20" />

        <div className="container mx-auto px-6 md:px-12 lg:px-24 h-full flex flex-col justify-end pb-6 md:pb-16 relative z-30 pointer-events-none">
          <div className="max-w-3xl bg-white/40 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent p-8 lg:p-0 border-2 lg:border-0 border-black animate-slide-up">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] mb-6">
              DÉCOUVERTE & FORMATION
            </span>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-black uppercase leading-[0.8] mb-6 drop-shadow-sm">
              NOS PROGRAMMES
            </h1>
            <div className="w-24 h-3 bg-primary"></div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-28 right-12 w-32 h-32 border-t-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
        <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-black/10 z-20 hidden lg:block"></div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-7xl">
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

            <p className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-white">
              La culture est ce qui reste quand on a tout oublié.
            </p>

          </div>

          <div className="w-24 h-2 bg-accent mx-auto"></div>

          <div className="pt-8">
            <Link
              href="/contact"
              className="inline-block px-8 md:px-12 py-5 bg-white text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Rejoindre l&apos;aventure
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
