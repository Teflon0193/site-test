import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Clock } from "lucide-react";
import { ApprovalCard } from "./ApprovalCard";

export default async function ApprovalsPage() {
  const user = await getUser();

  // Rediriger si non authentifié
  if (!user) {
    redirect("/auth/login");
  }

  // Rediriger les non-admins
  if (user.role !== "ADMIN") {
    redirect("/espace-membre");
  }

  // Récupérer les utilisateurs en attente d'approbation
  const pendingUsers = await prisma.user.findMany({
    where: {
      isApproved: false,
      role: "MEMBER", // Ne pas inclure les admins
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const approvedCount = await prisma.user.count({
    where: {
      isApproved: true,
      role: "MEMBER",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Demandes d&apos;approbation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gérez les demandes d&apos;adhésion des nouveaux membres
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="py-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {pendingUsers.length}
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
              {approvedCount}
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
              {pendingUsers.length + approvedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les membres
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des demandes */}
      <Card className="rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-4">
        <CardHeader>
          <CardTitle className="text-xl">
            Demandes en attente ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
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
                    name: pendingUser.name,
                    email: pendingUser.email,
                    createdAt: pendingUser.createdAt,
                    profile: pendingUser.profile,
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
