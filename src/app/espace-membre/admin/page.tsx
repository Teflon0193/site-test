import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { HiUsers, HiChartBar, HiUserAdd, HiClock } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
  const user = await getUser();

  if (user!.role !== "ADMIN") {
    redirect("/espace-membre");
  }

  // Récupérer les statistiques réelles
  const [
    totalMembers,
    approvedMembers,
    pendingMembers,
    totalActivities,
    recentMembers,
  ] = await Promise.all([
    // Total des membres (MEMBER uniquement)
    prisma.user.count({
      where: { role: "MEMBER" },
    }),
    // Membres approuvés
    prisma.user.count({
      where: { role: "MEMBER", isApproved: true },
    }),
    // Membres en attente
    prisma.user.count({
      where: { role: "MEMBER", isApproved: false },
    }),
    // Total des activités
    prisma.memberActivity.count(),
    // 5 derniers membres inscrits
    prisma.user.findMany({
      where: { role: "MEMBER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isApproved: true,
      },
    }),
  ]);

  // Calculer les membres de la semaine dernière
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newMembersThisWeek = await prisma.user.count({
    where: {
      role: "MEMBER",
      createdAt: { gte: oneWeekAgo },
    },
  });

  const stats = [
    {
      title: "Membres Totaux",
      value: totalMembers.toString(),
      icon: HiUsers,
      description: `${newMembersThisWeek} nouveaux cette semaine`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Membres Approuvés",
      value: approvedMembers.toString(),
      icon: HiUserAdd,
      description: `${Math.round(
        (approvedMembers / totalMembers) * 100
      )}% du total`,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "En Attente",
      value: pendingMembers.toString(),
      icon: HiClock,
      description: "Demandes à traiter",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Activités",
      value: totalActivities.toString(),
      icon: HiChartBar,
      description: "Actions enregistrées",
      color: "bg-purple-50 text-purple-600",
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
            {recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun membre pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {recentMembers.map((member) => {
                  const now = new Date();
                  const memberDate = new Date(member.createdAt);
                  const diffTime = Math.abs(
                    now.getTime() - memberDate.getTime()
                  );
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                  let dateLabel = "";
                  if (diffDays === 0) {
                    dateLabel = "Aujourd'hui";
                  } else if (diffDays === 1) {
                    dateLabel = "Hier";
                  } else if (diffDays < 7) {
                    dateLabel = `Il y a ${diffDays} jours`;
                  } else {
                    dateLabel = memberDate.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    });
                  }

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {member.name}
                          </p>
                          {member.isApproved ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <HiUserAdd className="w-3 h-3 mr-1" />
                              Approuvé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              <HiClock className="w-3 h-3 mr-1" />
                              En attente
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/60 truncate">
                          {member.email}
                        </p>
                      </div>
                      <p className="text-xs text-foreground/50 ml-2 whitespace-nowrap">
                        {dateLabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
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
