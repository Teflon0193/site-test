"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useSearchParams } from "next/navigation";
import { useMembersQuery } from "@/hooks/useAdminDashboardQuery";
import type { MembersStatusFilter } from "@/services/adminService";
import { MembersFilters } from "./MembersFilters";
import { MembersTable } from "./MembersTable";

interface MembersPageClientProps {
  initialSearch: string;
  initialStatus: string;
}

export function MembersPageClient({
  initialSearch,
  initialStatus,
}: MembersPageClientProps) {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? initialSearch ?? "";
  const statusParam =
    (searchParams.get("status") as MembersStatusFilter | null) ??
    (initialStatus as MembersStatusFilter) ??
    "all";

  const { data, isLoading, isError, error } = useMembersQuery({
    search,
    status: statusParam,
  });

  const members =
    data?.members.map((member) => ({
      ...member,
      // Assurer un nom non nul pour respecter le type Member du tableau
      name: member.name ?? "Membre sans nom",
      createdAt: new Date(member.createdAt),
    })) ?? [];

  const totalMembers = data?.totalMembers ?? 0;
  const approvedMembers = data?.approvedMembers ?? 0;
  const pendingMembers = data?.pendingMembers ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl uppercase font-bold text-foreground">
          Gestion des Membres
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Gérez les inscriptions et suivez les activités des membres
        </p>
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          Impossible de charger les membres : {error?.message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="py-4">
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">
              Total Membres
            </div>
            <div className="text-2xl font-bold mt-2">
              {isLoading ? "..." : totalMembers}
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">
              Approuvés
            </div>
            <div className="text-2xl font-bold mt-2 text-green-600">
              {isLoading ? "..." : approvedMembers}
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent>
            <div className="text-sm font-medium text-muted-foreground">
              En Attente
            </div>
            <div className="text-2xl font-bold mt-2 text-orange-600">
              {isLoading ? "..." : pendingMembers}
            </div>
          </CardContent>
        </Card>
      </div>

      <MembersFilters currentSearch={search} currentStatus={statusParam} />

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Membres {!isLoading && `(${members.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Chargement des membres...
            </p>
          ) : (
            <MembersTable members={members} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
