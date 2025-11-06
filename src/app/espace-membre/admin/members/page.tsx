import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MembersTable } from "./MembersTable";
import { MembersFilters } from "./MembersFilters";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const user = await getUser();

  // Rediriger les non-admins
  if (!user || user.role !== "ADMIN") {
    redirect("/espace-membre");
  }

  const params = await searchParams;
  const searchTerm = params.search || "";
  const filterStatus = params.status || "all";

  // Construire les filtres Prisma
  const whereClause: any = {
    role: "MEMBER", // Exclure les admins
  };

  // Filtre par recherche (nom ou email)
  if (searchTerm) {
    whereClause.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // Filtre par statut
  if (filterStatus === "validated") {
    whereClause.isApproved = true;
  } else if (filterStatus === "pending") {
    whereClause.isApproved = false;
  }

  // Récupérer les membres avec leurs activités
  const members = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isApproved: true,
      createdAt: true,
      _count: {
        select: {
          activities: true,
        },
      },
    },
  });

  // Statistiques
  const [totalMembers, approvedMembers, pendingMembers] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "MEMBER", isApproved: true } }),
    prisma.user.count({ where: { role: "MEMBER", isApproved: false } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Gestion des Membres
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Gérez les inscriptions et suivez les activités des membres
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="py-4">
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">
              Total Membres
            </div>
            <div className="text-2xl font-bold mt-2">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">
              Approuvés
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">
              {approvedMembers}
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">
              En Attente
            </div>
            <div className="text-2xl font-bold mt-2 text-orange-600">
              {pendingMembers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <MembersFilters
        currentSearch={searchTerm}
        currentStatus={filterStatus}
      />

      {/* Members Table */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Membres ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MembersTable members={members} />
        </CardContent>
      </Card>
    </div>
  );
}
