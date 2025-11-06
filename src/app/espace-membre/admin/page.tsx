import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const stats = [
    {
      title: "Membres Totaux",
      value: "342",
      icon: Users,
      description: "24 nouveaux cette semaine",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Événements",
      value: "12",
      icon: Calendar,
      description: "3 à venir ce mois",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Activités",
      value: "1,234",
      icon: Activity,
      description: "+18% depuis le mois dernier",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Taux d'engagement",
      value: "78%",
      icon: TrendingUp,
      description: "Inscriptions aux événements",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Dashboard Administrateur
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Bienvenue dans l&apos;espace de gestion du CCAPAC
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="py-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={cn("rounded-lg p-2", stat.color)}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-foreground/60 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Derniers Membres Inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Jean Dupont",
                  email: "jean.dupont@email.com",
                  date: "Aujourd'hui",
                },
                {
                  name: "Marie Mbongo",
                  email: "marie.mbongo@email.com",
                  date: "Hier",
                },
                {
                  name: "Pierre Kalala",
                  email: "pierre.kalala@email.com",
                  date: "Il y a 2 jours",
                },
              ].map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-foreground/60">{member.email}</p>
                  </div>
                  <p className="text-xs text-foreground/50">{member.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Événements à Venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Concert de Jazz", date: "15 Nov 2024", members: 45 },
                { name: "Exposition Photo", date: "20 Nov 2024", members: 32 },
                { name: "Atelier Théâtre", date: "22 Nov 2024", members: 18 },
              ].map((event) => (
                <div
                  key={event.name}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{event.name}</p>
                    <p className="text-xs text-foreground/60">{event.date}</p>
                  </div>
                  <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {event.members} inscrits
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
