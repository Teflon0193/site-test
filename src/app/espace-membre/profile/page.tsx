import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCalendar,
  HiUser,
  HiCheckCircle,
  HiClock,
} from "react-icons/hi";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await getUser();
  const userIsMember = user?.role === "MEMBER" ? "MEMBRE" : "ADMIN";

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === "ADMIN") {
    redirect("/espace-membre/admin");
  }

  // Les données du profil sont maintenant directement dans user

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-primary/10 md:mt-0 mt-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground uppercase">
          Mon Profil
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg mt-1">
          Consultez vos informations personnelles
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="overflow-hidden py-3 md:py-4">
        <CardHeader className="pb-4 md:pb-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-2xl md:text-4xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold mb-2">
                {user.name}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge
                  variant={user.isApproved ? "default" : "secondary"}
                  className="text-xs md:text-sm"
                >
                  {user.isApproved ? (
                    <span className="flex items-center gap-1">
                      <HiCheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                      Membre Actif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <HiClock className="h-3 w-3 md:h-4 md:w-4" />
                      En Attente
                    </span>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs md:text-sm">
                  {userIsMember}
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2 md:mt-3">
                Membre depuis le {memberSince}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card className="py-3 md:py-4">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <HiUser className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Informations Personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Nom complet */}
            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
              <div className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg">
                <HiUser className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Nom complet
                </p>
                <p className="font-semibold text-sm md:text-lg truncate">
                  {user.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
              <div className="p-1.5 md:p-2 bg-green-50 text-green-600 rounded-lg">
                <HiMail className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Email
                </p>
                <p className="font-semibold text-sm md:text-base break-all">
                  {user.email}
                </p>
                {user.emailVerified && (
                  <Badge variant="outline" className="mt-1.5 md:mt-2 text-xs">
                    <HiCheckCircle className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
            </div>

            {/* Téléphone */}
            {user.phone && (
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
                <div className="p-1.5 md:p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <HiPhone className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Téléphone
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {user.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Adresse */}
            {user.address && (
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
                <div className="p-1.5 md:p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <HiLocationMarker className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Adresse
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {user.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Membership Information */}
      <Card className="py-3 md:py-4">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <HiCalendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Informations d&apos;Adhésion
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Date d'inscription */}
            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
              <div className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg">
                <HiCalendar className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Date d&apos;adhésion
                </p>
                <p className="font-semibold text-sm md:text-base">
                  {memberSince}
                </p>
              </div>
            </div>

            {/* Statut d'approbation */}
            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
              <div
                className={cn(
                  "p-1.5 md:p-2 rounded-lg",
                  user.isApproved
                    ? "bg-green-50 text-green-600"
                    : "bg-orange-50 text-orange-600"
                )}
              >
                {user.isApproved ? (
                  <HiCheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <HiClock className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Statut du compte
                </p>
                <p className="font-semibold text-sm md:text-base">
                  {user.isApproved ? "Approuvé" : "En attente d'approbation"}
                </p>
                {!user.isApproved && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Votre compte sera activé après validation par un
                    administrateur
                  </p>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
              <div
                className={cn(
                  "p-1.5 md:p-2 rounded-lg",
                  user.newsletterOptIn
                    ? "bg-purple-50 text-purple-600"
                    : "bg-gray-50 text-gray-600"
                )}
              >
                <HiMail className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Newsletter
                </p>
                <p className="font-semibold text-sm md:text-base">
                  {user.newsletterOptIn ? "Activée" : "Désactivée"}
                </p>
              </div>
            </div>

            {/* Rôle */}
            <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg transition-colors">
              <div className="p-1.5 md:p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <HiUser className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  Rôle
                </p>
                <p className="font-semibold text-sm md:text-base">
                  {userIsMember}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info if profile exists */}
      {(user.city || user.country) && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 py-3 md:py-4">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <HiLocationMarker className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Localisation
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {user.city && (
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Ville
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {user.city}
                  </p>
                </div>
              )}
              {user.country && (
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">
                    Pays
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {user.country}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
