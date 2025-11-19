"use client";

import type { DehydratedState } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { HiUsers, HiChartBar, HiUserAdd, HiClock } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useAdminStatsQuery } from "@/hooks/useAdminDashboardQuery";

interface AdminDashboardClientProps {
  dehydratedState: DehydratedState;
}

function AdminDashboardContent() {
  const { data, isLoading, isError, error: queryError } = useAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-80 bg-muted rounded mt-3 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="py-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-7 w-16 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded mt-2 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Derniers Membres Inscrits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-16 bg-muted rounded animate-pulse ml-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader>
              <CardTitle>Événements à Venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Dashboard Administrateur
        </h1>
        <p className="text-sm text-destructive">
          Impossible de charger les statistiques admin.
        </p>
        {queryError && (
          <p className="text-xs text-destructive/80">{queryError.message}</p>
        )}
      </div>
    );
  }

  const {
    totalMembers,
    approvedMembers,
    pendingMembers,
    totalActivities,
    newMembersThisWeek,
    recentMembers,
  } = data;

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
      description: `${
        totalMembers > 0
          ? Math.round((approvedMembers / totalMembers) * 100)
          : 0
      }% du total`,
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
      <div>
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Dashboard Administrateur
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Bienvenue dans l&apos;espace de gestion du CCAPAC
        </p>
      </div>

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
                  <Icon className="h-6 w-6" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

export default function AdminDashboardClient({
  dehydratedState,
}: AdminDashboardClientProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <AdminDashboardContent />
    </HydrationBoundary>
  );
}
