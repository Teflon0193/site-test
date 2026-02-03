import MainLayout from "../components/layouts/MainLayout";
import ContactForm from "./contact-form";
import { GoogleMapsButton } from "./GoogleMapsButton";
import Image from "next/image";

export default function InfosPratiquesPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/media/visite.jpg"
            alt="Infos Pratiques CCAPAC"
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
            Contact & Accès
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-white tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
            Infos Pratiques
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-accent"></div>
            <div className="h-[2px] w-12 bg-accent"></div>
          </div>
          <p className="text-xl sm:text-2xl text-zinc-200 font-medium max-w-3xl mx-auto leading-relaxed border-l-4 border-accent pl-6 text-left md:text-center md:border-l-0 md:pl-0">
            Tout ce qu&apos;il faut savoir pour nous rendre visite, nous
            contacter ou participer à nos activités.
          </p>
        </div>
      </section>

      <div className="bg-white px-4 sm:px-10 lg:px-16 py-16 lg:py-32">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left Column: Info Cards */}
          <div className="space-y-24">
            {/* Horaires */}
            <div className="space-y-8">
              <div className="flex items-center gap-6 border-b-2 border-black pb-6">
                <span className="text-accent font-black text-lg">01</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  Horaires
                </h2>
              </div>

              <div className="bg-zinc-50 border-2 border-black p-6 sm:p-10 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-200 pb-6">
                  <span className="font-black uppercase tracking-widest text-[10px] text-zinc-400">
                    Lundi - Vendredi
                  </span>
                  <span className="font-black text-2xl tracking-tighter">
                    08:00 — 16:00
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-200 pb-6">
                  <span className="font-black uppercase tracking-widest text-[10px] text-zinc-400">
                    Samedi
                  </span>
                  <span className="font-black text-2xl tracking-tighter">
                    09:00 — 16:00
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-200 pb-6">
                  <span className="font-black uppercase tracking-widest text-[10px] text-zinc-400">
                    Dimanche
                  </span>
                  <span className="font-black text-2xl tracking-tighter">
                    14:00 — 18:00
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent pt-2">
                  * Fermé les jours fériés
                </div>
              </div>
            </div>

            {/* Accès */}
            <div className="space-y-8">
              <div className="flex items-center gap-6 border-b-2 border-black pb-6">
                <span className="text-accent font-black text-lg">02</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  Accès
                </h2>
              </div>

              <div className="bg-black text-white p-6 sm:p-10 space-y-10 border-2 border-black">
                <div className="grid sm:grid-cols-2 gap-10">
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-500 mb-4">
                      Adresse
                    </h3>
                    <p className="text-xl leading-tight font-black uppercase tracking-tighter">
                      Boulevard Triomphal
                      <br />
                      Kinshasa, RDC
                    </p>
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-[10px] text-zinc-500 mb-4">
                      Parking
                    </h3>
                    <p className="text-xl leading-tight font-black uppercase tracking-tighter">
                      Gratuit et <br /> surveillé sur place.
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <GoogleMapsButton />
                </div>
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="space-y-8">
              <div className="flex items-center gap-6 border-b-2 border-black pb-6">
                <span className="text-accent font-black text-lg">03</span>
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  Contacts
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-black bg-white">
                <div className="p-8 border-b md:border-b-0 md:border-r-2 border-black hover:bg-zinc-50 transition-colors">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                    Accueil
                  </p>
                  <p className="font-black text-2xl tracking-tighter mb-4">
                    +243 995 505 050
                  </p>
                  <a
                    href="mailto:info@centreculturel.cd"
                    className="text-xs font-black uppercase tracking-widest border-b-2 border-accent hover:text-accent transition-colors pb-1"
                  >
                    Envoyer un mail
                  </a>
                </div>
                <div className="p-8 hover:bg-zinc-50 transition-colors">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                    Programmation
                  </p>
                  <p className="font-black text-2xl tracking-tighter mb-4">
                    +243 81 000 0000
                  </p>
                  <a
                    href="mailto:prog@centreculturel.cd"
                    className="text-xs font-black uppercase tracking-widest border-b-2 border-accent hover:text-accent transition-colors pb-1"
                  >
                    Envoyer un mail
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white border-2 border-black p-6 sm:p-10 lg:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-full">
              <div className="mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">
                  Écrivez-nous
                </span>
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                  Une <br /> Question ?
                </h2>
                <div className="w-16 h-2 bg-black" />
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
