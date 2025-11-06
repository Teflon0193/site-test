import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();

  if (user!.role === "ADMIN") {
    redirect("/espace-membre/admin");
  }

  const memberSince = new Date(user!.createdAt).toLocaleDateString("fr-FR");
  const eventsRegistered = 0; // TODO: calculer via EventRegistration
  const upcomingEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    status: "registered" | "pending";
  }> = [];
  const recentActivities: Array<{
    id: number;
    type: "registration" | "attendance" | "newsletter";
    event: string;
    date: string;
  }> = [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue, {user!.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Membre depuis le {memberSince}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="py-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Événements inscrits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{eventsRegistered}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Accès prioritaire garanti
            </p>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Statut du compte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-secondary text-secondary-foreground">
              Actif
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Tarifs préférentiels disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Prochains événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {upcomingEvents.filter((e) => e.status === "registered").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Confirmés pour vous
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Mes prochains événements</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-md transition-shadow py-6"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge
                        variant={
                          event.status === "registered" ? "default" : "outline"
                        }
                      >
                        {event.status === "registered"
                          ? "Confirmé"
                          : "En attente"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(event.date).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Activités récentes</h2>
        <Card className="py-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {activity.type === "registration" && "📝 Inscription"}
                      {activity.type === "attendance" && "✓ Présence"}
                      {activity.type === "newsletter" && "📧 Newsletter"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.event}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
