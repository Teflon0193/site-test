"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Clock } from "lucide-react";
import { usePendingApprovalsQuery } from "@/hooks/useAdminDashboardQuery";
import { ApprovalCard } from "./ApprovalCard";

export function ApprovalsPageClient() {
  const { data, isLoading, isError, error } = usePendingApprovalsQuery();

  const pendingUsers = data?.pendingUsers ?? [];
  const approvedCount = data?.approvedCount ?? 0;
  const pendingCount = pendingUsers.length;
  const total = approvedCount + pendingCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Demandes d&apos;approbation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gérez les demandes d&apos;adhésion des nouveaux membres
        </p>
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          Impossible de charger les demandes : {error?.message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {isLoading ? "..." : pendingCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Demandes à traiter
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approuvés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isLoading ? "..." : approvedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Membres actifs</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {isLoading ? "..." : total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les membres
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-4">
        <CardHeader>
          <CardTitle className="text-xl">
            Demandes en attente ({isLoading ? "..." : pendingCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">
                Chargement des demandes en attente...
              </p>
            </div>
          ) : pendingCount === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucune demande en attente pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
