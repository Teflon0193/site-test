import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { HiCalendar, HiClock, HiCheckCircle, HiUser } from "react-icons/hi";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getUser();

  if (user!.role === "ADMIN") {
    redirect("/espace-membre/admin");
  }

  // Récupérer les données réelles du membre
  const [eventsRegistered, recentActivities, memberProfile] = await Promise.all(
    [
      // Nombre d'événements inscrits
      prisma.eventRegistration.count({
        where: {
          userId: user!.id,
          status: { in: ["CONFIRMED", "PENDING"] },
        },
      }),
      // 5 dernières activités
      prisma.memberActivity.findMany({
        where: { userId: user!.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // Profil du membre
      prisma.memberProfile.findUnique({
        where: { userId: user!.id },
      }),
    ]
  );

  // Événements confirmés à venir
  const confirmedEvents = await prisma.eventRegistration.count({
    where: {
      userId: user!.id,
      status: "CONFIRMED",
    },
  });

  const memberSince = new Date(user!.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Statistiques pour les cards
  const stats = [
    {
      title: "Événements Inscrits",
      value: eventsRegistered.toString(),
      icon: HiCalendar,
      description: "Inscriptions en cours",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Événements Confirmés",
      value: confirmedEvents.toString(),
      icon: HiCheckCircle,
      description: "Participation assurée",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Activités Récentes",
      value: recentActivities.length.toString(),
      icon: HiClock,
      description: "Dernières actions",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Statut Membre",
      value: user!.isApproved ? "Actif" : "En attente",
      icon: HiUser,
      description: `Membre depuis ${memberSince.split(" ")[2]}`,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-primary/10 md:mt-0 mt-4">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          Bienvenue, {user!.name}
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg">
          Membre depuis le {memberSince}
        </p>
        {memberProfile && (
          <div className="mt-3 md:mt-4 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
            {memberProfile.phone && (
              <span className="text-muted-foreground">
                {memberProfile.phone}
              </span>
            )}
            {memberProfile.address && (
              <span className="text-muted-foreground">
                {memberProfile.address}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 py-3 md:py-4"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("rounded-lg p-1.5 md:p-2", stat.color)}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1",
                  stat.color.replace("bg-", "bg-gradient-to-r from-")
                )}
              />
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      {/* <div>
        <h2 className="text-2xl font-bold mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all cursor-pointer group py-4">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiCalendar className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Événements</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Découvrir et s&apos;inscrire
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group py-4">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiUser className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mon Profil</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Mettre à jour mes infos
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer group py-4">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <HiClock className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mes Activités</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Historique complet
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div> */}

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
          Activités Récentes
        </h2>
        {recentActivities.length > 0 ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y">
                {recentActivities.map((activity) => {
                  const getActivityIcon = (type: string) => {
                    switch (type) {
                      case "SIGNUP":
                        return "🎉";
                      case "LOGIN":
                        return "🔐";
                      case "PROFILE_UPDATE":
                        return "✏️";
                      case "EVENT_REGISTER":
                        return "📝";
                      case "EVENT_CANCEL":
                        return "❌";
                      case "ADMIN_ACTION":
                        return "⚙️";
                      default:
                        return "📌";
                    }
                  };

                  const getActivityLabel = (type: string) => {
                    switch (type) {
                      case "SIGNUP":
                        return "Inscription au site";
                      case "LOGIN":
                        return "Connexion";
                      case "PROFILE_UPDATE":
                        return "Mise à jour du profil";
                      case "EVENT_REGISTER":
                        return "Inscription à un événement";
                      case "EVENT_CANCEL":
                        return "Annulation d'un événement";
                      case "ADMIN_ACTION":
                        return "Action administrative";
                      default:
                        return "Activité";
                    }
                  };

                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 md:p-4 hover:bg-muted/5 transition-colors gap-2"
                    >
                      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                        <span className="text-xl md:text-2xl flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm md:text-base truncate">
                            {getActivityLabel(activity.type)}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs flex-shrink-0 hidden sm:inline-flex"
                      >
                        {activity.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="py-8 md:py-12">
            <CardContent className="text-center">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">📋</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Aucune activité récente
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Vos actions apparaîtront ici
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Newsletter Opt-in Notice */}
      {user!.newsletterOptIn && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="py-4 md:py-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-3xl md:text-4xl flex-shrink-0">📧</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base md:text-lg mb-1">
                  Newsletter Activée
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Vous recevez nos actualités et informations sur les événements
                  à venir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
