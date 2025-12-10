import MainLayout from "../components/layouts/MainLayout";
import ContactForm from "./contact-form";
import { GoogleMapsButton } from "./GoogleMapsButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  FaMapPin,
  FaClock,
  FaPhone,
  FaMailBulk,
  FaCalendar,
  FaBuilding,
  FaInfo,
} from "react-icons/fa";

export default function InfosPratiquesPage() {
  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-muted/5 via-background to-muted/10 border-b border-muted/20 mt-20 sm:mt-24 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-12">
          <div className="max-w-4xl">
            <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight drop-shadow-sm">
              Informations Pratiques
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Toutes les informations nécessaires pour visiter le CCAPAC, louer
              nos espaces et nous contacter
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 mt-10">
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
          <section id="visiter">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Visiter le Centre
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg sm:text-xl">
                Le CCAPAC vous accueille tout au long de la semaine pour
                découvrir nos expositions et participer à nos événements
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
              <Card className="group h-full py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex uppercase items-center gap-4 text-xl sm:text-2xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300">
                      <FaClock className="h-6 w-6 text-primary" />
                    </div>
                    Horaires d&apos;ouverture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-muted/20">
                      <span className="font-semibold text-foreground text-base sm:text-lg">
                        Lundi - Vendredi
                      </span>
                      <span className="text-primary font-bold text-base sm:text-lg">
                        8h00 - 16h00
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-muted/20">
                      <span className="font-semibold text-foreground text-base sm:text-lg">
                        Samedi
                      </span>
                      <span className="text-primary font-bold text-base sm:text-lg">
                        09h00 - 16h00
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-muted/20">
                      <span className="font-semibold text-foreground text-base sm:text-lg">
                        Dimanche
                      </span>
                      <span className="text-primary font-bold text-base sm:text-lg">
                        13h00 - 17h00
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 flex items-start gap-4 bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/20">
                    <FaInfo className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Fermé les jours fériés. Horaires spéciaux pendant les
                      vacances scolaires.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group h-full py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex uppercase items-center gap-4 text-xl sm:text-2xl">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300">
                      <FaMapPin className="h-6 w-6 text-primary" />
                    </div>
                    Accès et localisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-muted/20">
                      <p className="font-semibold text-foreground text-base sm:text-lg mb-2">
                        Adresse
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        Boulevard Triomphal
                        <br />
                        Kinshasa, République Démocratique du Congo
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-muted/20">
                      <p className="font-semibold text-foreground text-base sm:text-lg mb-2">
                        Parking
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        Gratuit
                      </p>
                    </div>
                  </div>
                  <GoogleMapsButton />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* <section id="location">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Location d&apos;Espaces
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Le CCAPAC met à disposition ses espaces pour vos événements
                culturels, conférences et répétitions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex uppercase items-center gap-3 text-xl mt-5">
                      <div className="p-2">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      Nos espaces disponibles
                    </CardTitle>
                    <CardDescription>
                      Équipements professionnels et services sur mesure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-primary bg-card rounded-r-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          Grande Salle
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          300 places • Scène 12x8m • Son et éclairage
                          professionnel
                        </p>
                        <p className="font-semibold text-primary">
                          À partir de 800€/jour
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-primary bg-card rounded-r-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          Salle de Conférence
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          120 places • Équipement audiovisuel • Climatisation
                        </p>
                        <p className="font-semibold text-primary">
                          À partir de 400€/jour
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-primary bg-card rounded-r-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          Studio de Répétition
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          50m² • Piano • Miroirs • Parquet
                        </p>
                        <p className="font-semibold text-primary">
                          À partir de 80€/jour
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-primary bg-card rounded-r-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          Espace d&apos;Exposition
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          200m² • Éclairage modulable • Sécurité 24h/24
                        </p>
                        <p className="font-semibold text-primary">
                          À partir de 300€/jour
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Fiches techniques
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Disponibilités
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Demande de devis</CardTitle>
                  <CardDescription>
                    Obtenez un devis personnalisé pour votre événement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input id="nom" placeholder="Votre nom" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input id="telephone" placeholder="01 23 45 67 89" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="espace">Espace souhaité *</Label>
                      <select className="w-full p-2 border border-input rounded-md bg-background text-foreground">
                        <option>Sélectionnez un espace</option>
                        <option>Grande Salle</option>
                        <option>Salle de Conférence</option>
                        <option>Studio de Répétition</option>
                        <option>Espace d&apos;Exposition</option>
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-debut">Date de début *</Label>
                        <Input id="date-debut" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-fin">Date de fin</Label>
                        <Input id="date-fin" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description de l&apos;événement *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Décrivez votre projet, le nombre d'invités, les équipements nécessaires..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button className="w-full" size="lg">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section> */}

          <section id="contacts">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Nous Contacter
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg lg:text-xl">
                Notre équipe est à votre disposition pour répondre à toutes vos
                questions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              <Card className="group h-full py-4 sm:py-6 lg:py-8 rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl uppercase flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300">
                      <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    Contacts directs
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base lg:text-lg">
                    Contactez directement le service concerné
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="group/contact flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300 flex-shrink-0">
                      <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">
                        Accueil général
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base break-all">
                        +243 995 505 050
                      </p>
                    </div>
                  </div>

                  <div className="group/contact flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300 flex-shrink-0">
                      <FaMailBulk className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">
                        Information
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base break-all">
                        info@centreculturel.cd
                      </p>
                    </div>
                  </div>

                  <div className="group/contact flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300 flex-shrink-0">
                      <FaBuilding className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">
                        Location d&apos;espaces
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base break-all">
                        location@centreculturel.cd
                      </p>
                    </div>
                  </div>

                  <div className="group/contact flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 rounded-xl border border-transparent hover:border-primary/20">
                    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 transition-transform duration-300 flex-shrink-0">
                      <FaCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base lg:text-lg">
                        Programmation
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base break-all">
                        programmation@centreculturel.cd
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group h-full py-4 sm:py-6 lg:py-8 rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl uppercase flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20">
                      <FaMailBulk className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    Formulaire de contact
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base lg:text-lg">
                    Une question ? Contactez-nous directement
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
