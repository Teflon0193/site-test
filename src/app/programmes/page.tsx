import Link from "next/link";
import Image from "next/image";
import Header from "../components/home/header";
import Footer from "../components/home/footer";
import { categories } from "@/lib/programmes-data";
import { FaArrowRight } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function ProgrammesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <Header />

      {/* Hero Section */}
      <section className="relative lg:h-[45vh] h-[40vh] lg:mt-12 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
        <Image
          src="/motif-luba.png"
          alt="Programmes culturels CCAPAC"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        <div className="relative z-20 text-center text-white px-4 mt-20">
          <h1 className="uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance drop-shadow-lg">
            Nos Programmes
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl max-w-3xl mx-auto text-balance text-white/90 leading-relaxed drop-shadow-md">
            Découvrez nos initiatives culturelles dédiées à la promotion et à la
            préservation du patrimoine africain
          </p>
        </div>
      </section>

      {/* Introduction */}
      {/* <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl uppercase md:text-3xl font-bold mb-6 text-balance">
            Quatre axes stratégiques pour la culture
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Le CCAPAC structure son action autour de quatre grands domaines
            culturels, chacun contribuant à valoriser la richesse et la
            diversité du patrimoine congolais et africain. De la musique au
            cinéma, du théâtre à la littérature, nos programmes accompagnent les
            artistes et transmettent les savoirs aux nouvelles générations.
          </p>
        </div>
      </section> */}

      {/* Categories */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-fr">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/programmes/${category.id}`}
                className="group h-full"
              >
                <Card className="h-full flex rounded-2xl flex-col overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-muted/10 border border-muted/20">
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <div className="text-4xl font-bold text-white/40 drop-shadow-lg">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl sm:text-2xl text-foreground uppercase font-bold group-hover:text-primary transition-colors line-clamp-2 text-balance">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pb-3">
                    <CardDescription className="line-clamp-3 text-pretty leading-relaxed text-sm sm:text-base text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="">
                    <div className="flex items-center text-sm text-primary font-semibold mb-4 group-hover:text-primary/80 transition-colors">
                      Découvrir
                      <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl uppercase md:text-4xl font-bold mb-4 sm:mb-6 text-balance text-foreground drop-shadow-sm">
            Participez à nos programmes
          </h2>
          <p className="text-md sm:text-lg text-muted-foreground mb-6 sm:mb-8 text-pretty leading-relaxed">
            Que vous soyez artiste, chercheur, étudiant ou simplement passionné
            de culture, nos programmes sont ouverts à tous. Rejoignez-nous pour
            contribuer au rayonnement de la culture africaine.
          </p>
          <Link
            href="/contact"
            className="inline-flex text-base items-center justify-center px-8 py-3 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black font-bold cursor-pointer rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
