"use client";

import Header from "../../components/home/header";
import Footer from "../../components/home/footer";
import { IoIosMail } from "react-icons/io";
import { FaUsers, FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import {
  directionGenerale,
  communicationAdmin,
  programmesEvenements,
  logistiqueSecurite,
  techniqueProduction,
  financesAccueil,
  centreAccueil,
  dramatheque,
  bes,
} from "@/data/member";

const departments = [
  {
    id: "direction",
    name: "Direction Générale",
    members: [directionGenerale],
    gridCols: "max-w-xs mx-auto",
  },
  {
    id: "communication",
    name: "Communication & Administration",
    members: communicationAdmin,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4",
  },
  {
    id: "programmes",
    name: "Programmes & Événements",
    members: programmesEvenements,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto",
  },
  {
    id: "logistique",
    name: "Logistique & Sécurité",
    members: logistiqueSecurite,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto",
  },
  {
    id: "technique",
    name: "Technique & Production",
    members: techniqueProduction,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4",
  },
  {
    id: "finances",
    name: "Finances & Accueil",
    members: financesAccueil,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto",
  },
  {
    id: "centre",
    name: "Centre d'Accueil & Résidence Créative",
    members: centreAccueil,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto",
  },
  {
    id: "dramatheque",
    name: "Dramathèque",
    members: dramatheque,
    gridCols:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto",
  },
  {
    id: "bes",
    name: "BES",
    members: [bes],
    gridCols: "max-w-xs mx-auto",
  },
];

export default function EquipeGouvernancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-5">
        {/* Hero Section */}
        <section className="relative lg:h-[50vh] h-[40vh] lg:mt-12 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
          <Image
            src="/motif-luba.png"
            alt="Equipe CCAPAC"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <Link
              href="/grand-tambour/presentation"
              className="inline-flex items-center gap-2 text-white/90 hover:text-accent mb-6 sm:mb-8 transition-all duration-300 text-sm sm:text-base bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <FaArrowLeft className="w-4 h-4" />
              Retour à la présentation
            </Link>
            <h1 className="uppercase text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight text-balance drop-shadow-lg">
              L&apos;Équipe du CCAPAC
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto text-pretty leading-relaxed drop-shadow-md">
              Découvrez l&apos;équipe passionnée qui donne vie au Centre
              Culturel et Artistique pour l&apos;Afrique Centrale
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="direction"
              className="space-y-4"
            >
              {departments.map((dept) => (
                <AccordionItem
                  key={dept.id}
                  value={dept.id}
                  className="border rounded-lg overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors cursor-pointer uppercase">
                    <div className="flex items-center gap-3 text-left">
                      <FaUsers className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <h2 className="text-sm sm:text-xl font-bold text-foreground">
                          {dept.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {dept.members.length}{" "}
                          {dept.members.length === 1 ? "membre" : "membres"}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 py-8">
                    <div className={dept.gridCols}>
                      {dept.members.map((member, index) => (
                        <Card
                          key={index}
                          className="group overflow-hidden rounded-xl border-0 bg-gradient-to-br from-white to-muted/20"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60">
                            <Image
                              src={member.photo || "/placeholder.svg"}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <CardHeader className="text-center pb-2 pt-4 px-3 sm:px-4">
                            <CardTitle className="text-sm sm:text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                              {member.name}
                            </CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                              {member.position}
                            </p>
                          </CardHeader>

                          <CardContent className="text-center pb-4 pt-1 px-3 sm:px-4">
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-xs sm:text-sm bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-full group-hover:shadow-md"
                            >
                              <IoIosMail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate max-w-[120px] sm:max-w-[150px]">
                                {member.email}
                              </span>
                            </a>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-muted/10 via-muted/5 to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="uppercase text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                Notre Engagement
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12 max-w-4xl mx-auto text-pretty">
                L&apos;équipe du CCAPAC s&apos;engage quotidiennement à
                promouvoir la culture africaine et congolaise, à soutenir la
                création artistique locale et à offrir au public des expériences
                culturelles enrichissantes et accessibles à tous.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12">
                <Card className="group text-center p-6 sm:p-8 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/10 border-0">
                  <div className="relative mb-6">
                    <Image
                      src="/creer.png"
                      alt="logo créer"
                      width={100}
                      height={100}
                      className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto transition-transform duration-300"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    Créer
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Nous visons la création artistique dans tous nos projets
                    culturels
                  </p>
                </Card>

                <Card className="group text-center p-6 sm:p-8 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/10 border-0">
                  <div className="relative mb-6">
                    <Image
                      src="/grandir.png"
                      alt="logo grandir"
                      width={100}
                      height={100}
                      className="h-16 w-16 sm:h-20 sm:w-20 text-secondary mx-auto transition-transform duration-300"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    Grandir
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Nous encourageons l&apos;innovation artistique et culturelle
                    et le développement des talents
                  </p>
                </Card>

                <Card className="group text-center p-6 sm:p-8 sm:col-span-2 lg:col-span-1 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/10 border-0">
                  <div className="relative mb-6">
                    <Image
                      src="/eduquer.png"
                      alt="logo eduquer"
                      width={100}
                      height={100}
                      className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto transition-transform duration-300"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    Eduquer
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Nous éduquons les jeunes à la culture africaine et
                    congolaise
                  </p>
                </Card>

                <Card className="group text-center p-6 sm:p-8 sm:col-span-2 lg:col-span-1 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/10 border-0">
                  <div className="relative mb-6">
                    <Image
                      src="/celebrer.png"
                      alt="logo celebrer"
                      width={100}
                      height={100}
                      className="h-16 w-16 sm:h-20 sm:w-20 text-primary mx-auto transition-transform duration-300"
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    Célébrer
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Nous célébrons la culture africaine et congolaise
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
