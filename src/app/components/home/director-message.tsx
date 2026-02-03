import Image from "next/image";

export default function DirectorMessage() {
  return (
    <section className="py-24 lg:py-32 bg-primary text-black relative overflow-hidden border-y border-white/10">
      {/* Deep Background Image */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 pointer-events-none hidden lg:block">
        <div className="relative w-full h-full">
          <Image
            src="/images/mukishi.png"
            alt="Masque traditionnel"
            fill
            className="object-contain object-right-bottom grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent" />
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Content Side */}
          <div className="lg:col-span-8">
            <div className="mb-12 border-l-8 border-foreground pl-8">

              <h2 className="text-2xl md:text-4xl text-white lg:text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                Une vision partagée de notre  <br />
                <span className="text-white">héritage culturel</span>
              </h2>
            </div>

            <div className="space-y-12">
              <div className="relative">
                <p className="text-xl md:text-2xl lg:text-xl font-medium leading-tight tracking-tight text-white/90">
                  Le CCAPAC incarne notre vision commune de célébrer et
                  préserver l&apos;extraordinaire diversité culturelle de
                  l&apos;Afrique Centrale. Ensemble, nous bâtissons un pont
                  entre nos traditions ancestrales et les expressions
                  artistiques contemporaines.
                </p>
              </div>

              {/* Signature Block - Sharp & Minimalist */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-8 border-t border-white/10">
                <div className="relative group">
                  <div className="w-24 h-24 border border-white/20 p-2 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105">
                    <Image
                      src="/images/members/balufu.jpg"
                      alt="Balufu Bakupa-Kanyinda"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xl text-white font-black uppercase tracking-tighter">
                    Balufu Bakupa-Kanyinda
                  </p>
                  <p className="text-zinc-500 font-black tracking-[0.2em] text-[10px] uppercase">
                    Directeur Général
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Visualization Overlay or Spacer */}
          <div className="lg:col-span-4 flex items-end justify-center lg:justify-end">
            {/* Small decorative element for mobile/smaller screens to hint at the deep background image */}
            <div className="lg:hidden relative w-full aspect-square opacity-20 max-w-xs">
              <Image
                src="/images/mukishi.png"
                alt="Masque traditionnel"
                fill
                className="object-contain grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
