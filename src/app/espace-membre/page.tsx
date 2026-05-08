import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Header from "../components/home/header";
import Footer from "../components/home/footer";

export default function EspaceMembres() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-muted/10 via-muted/5 to-muted/0 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
            <h1 className="text-4xl md:text-5xl uppercase font-bold text-foreground mb-6 drop-shadow-sm">
              Espace Membres
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Rejoignez la communauté du CCAPAC et bénéficiez d&apos;avantages
              exclusifs pour soutenir les arts et la culture.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Message */}
            <Card className="mb-12 rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-6 sm:py-8">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <CardTitle className="text-2xl md:text-3xl font-bold drop-shadow-sm">
                  Devenez Membre du CCAPAC
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mt-2 text-muted-foreground">
                  Soutenez les arts et la culture tout en profitant
                  d&apos;avantages exclusifs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center text-sm sm:text-base md:text-lg leading-relaxed">
                  Le Centre Culturel et Artistique pour les Pays d&apos;Afrique
                  Centrale (CCAPAC) propose un programme de membership pour tous
                  ceux qui souhaitent soutenir notre mission de promotion des
                  arts et de la culture.
                </p>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 pt-4">
                  <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-4 sm:p-5 border border-muted/20 transition-all duration-300 hover:shadow-md">
                    <h3 className="font-semibold text-foreground mb-2">
                      Accès Prioritaire
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Réservations prioritaires pour les spectacles et
                      événements
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-4 sm:p-5 border border-muted/20 transition-all duration-300 hover:shadow-md">
                    <h3 className="font-semibold text-foreground mb-2">
                      Tarifs Préférentiels
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Réductions sur les billets et les ateliers
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-4 sm:p-5 border border-muted/20 transition-all duration-300 hover:shadow-md">
                    <h3 className="font-semibold text-foreground mb-2">
                      Événements Exclusifs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Invitations à des rencontres privées avec les artistes
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-4 sm:p-5 border border-muted/20 transition-all duration-300 hover:shadow-md">
                    <h3 className="font-semibold text-foreground mb-2">
                      Newsletter
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Informations en avant-première sur la programmation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-gradient-to-br from-white to-muted/10 border border-muted/20 rounded-2xl shadow-lg py-6 sm:py-8">
              <CardHeader className="text-center pb-2 sm:pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold drop-shadow-sm">
                  Contactez-nous pour en savoir plus
                </CardTitle>
                <CardDescription>
                  Notre équipe se fera un plaisir de vous renseigner sur les
                  modalités d&apos;adhésion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {/* Email */}
                  <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center shadow-sm">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:info@centreculturel.cd"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        info@centreculturel.cd
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center shadow-sm">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Téléphone
                      </p>
                      <a
                        href="tel:+243995505050"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        +243 890 809 746
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Adresse
                      </p>
                      <p className="font-medium text-foreground">
                        Kinshasa, République Démocratique du Congo
                        <br />
                        Boulevard Triomphal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <a href="mailto:info@centreculturel.cd">
                      <span className="text-black font-bold">
                        Nous Contacter
                      </span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
