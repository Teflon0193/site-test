"use client";

import {
  Card,
  CardContent,
} from "@/app/components/ui/card";
import { Clock, CheckCircle2, Users, Inbox } from "lucide-react";
import { usePendingApprovalsQuery } from "@/hooks/useAdminDashboardQuery";
import { ApprovalCard } from "./ApprovalCard";
import { cn } from "@/lib/utils";

export function ApprovalsPageClient() {
  const { data, isLoading, isError, error } = usePendingApprovalsQuery();

  const pendingUsers = data?.pendingUsers ?? [];
  const approvedCount = data?.approvedCount ?? 0;
  const pendingCount = pendingUsers.length;
  const total = approvedCount + pendingCount;

  const stats = [
    {
      title: "En attente",
      value: isLoading ? "..." : pendingCount,
      icon: Clock,
      description: "Demandes à traiter",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Approuvés",
      value: isLoading ? "..." : approvedCount,
      icon: CheckCircle2,
      description: "Membres actifs",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total",
      value: isLoading ? "..." : total,
      icon: Users,
      description: "Tous les membres",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Demandes d&apos;approbation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez les demandes d&apos;adhésion des nouveaux membres
        </p>
      </div>

      {isError && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
          Impossible de charger les demandes : {error?.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-none shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div
                    className={cn("rounded-full p-2", stat.bgColor, stat.color)}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Inbox className="h-5 w-5 text-primary" />
          Demandes en attente
          {!isLoading && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({pendingCount})
            </span>
          )}
        </h2>

        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Chargement des demandes...
            </p>
          </div>
        ) : pendingCount === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              Tout est à jour
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Aucune demande en attente pour le moment
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingUsers.map((pendingUser) => (
              <ApprovalCard
                key={pendingUser.id}
                user={{
                  id: pendingUser.id,
                  name: pendingUser.name ?? "",
                  email: pendingUser.email,
                  createdAt: new Date(pendingUser.createdAt),
                  phone: pendingUser.phone ?? "",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
