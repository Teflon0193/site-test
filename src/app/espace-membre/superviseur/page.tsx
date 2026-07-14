"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, FileText, RefreshCw, Search, ShieldAlert, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RequestStatusBadge from "@/components/space-requests/RequestStatusBadge";
import type { SpaceRequest } from "@/services/spaceRequestService";
import { supervisorService } from "./supervisorService";

const departments: Record<string, string> = {
  MEMBER: "Membre", PROGRAMME: "Programmes", REGISSEUR_GENERAL: "Régisseur général",
  DIRECTION_ARTISTIQUE: "Direction artistique", COMMUNICATION: "Communication",
  JURIDIQUE: "Juridique", FINANCE: "Finances", ADMIN: "Administration",
};

export default function SupervisorDashboardPage() {
  const [requests, setRequests] = useState<SpaceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    try { setLoading(true); setRequests(await supervisorService.getOverview()); }
    catch (error) { console.error(error); toast.error("Impossible de charger la vue globale."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const stats = useMemo(() => ({
    total: requests.length,
    active: requests.filter((r) => !["completed", "rejected"].includes(r.status)).length,
    completed: requests.filter((r) => r.status === "completed").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }), [requests]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return requests;
    }

    return requests.filter((request) => {
      const reference = String(request.reference || "").toLowerCase();
      const activity = String(
        request.eventName || request.title || ""
      ).toLowerCase();

      return reference.includes(query) || activity.includes(query);
    });
  }, [requests, searchQuery]);

  return <div className="space-y-7">
    <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8"><p className="text-sm uppercase tracking-wider text-white/75">Supervision générale</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Vue d’ensemble du processus</h1><p className="mt-3 max-w-3xl text-white/85">Surveillez le parcours de toutes les demandes et identifiez rapidement le département responsable de chaque étape.</p></section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Total", value: stats.total, icon: FileText, style: "bg-blue-50 text-blue-700" },
      { label: "En traitement", value: stats.active, icon: Clock3, style: "bg-amber-50 text-amber-700" },
      { label: "Terminées", value: stats.completed, icon: CheckCircle2, style: "bg-green-50 text-green-700" },
      { label: "Rejetées", value: stats.rejected, icon: ShieldAlert, style: "bg-red-50 text-red-700" },
    ].map(({ label, value, icon: Icon, style }) => <div key={label} className="rounded-2xl border border-[#D1965B]/15 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-[#5C4033]/60">{label}</p><p className="mt-1 text-3xl font-bold text-[#5C4033]">{value}</p></div><div className={`rounded-xl p-3 ${style}`}><Icon className="h-7 w-7" /></div></div></div>)}</div>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold text-[#5C4033]">Suivi des demandes</h2><p className="text-sm text-[#5C4033]/60">Cette vue n’effectue aucune validation à la place des départements.</p></div><Button variant="outline" onClick={() => void load()} className="border-[#D1965B]/40 text-[#5C4033]"><RefreshCw className="mr-2 h-4 w-4" />Actualiser</Button></div>
    <div className="flex flex-col gap-3 rounded-2xl border border-[#D1965B]/15 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C4033]/40" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Rechercher par référence ou nom d’activité..."
          className="border-[#D1965B]/25 bg-[#F8F5EF]/50 pl-10 pr-10 text-[#5C4033] focus-visible:ring-[#D1965B]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#5C4033]/50 hover:bg-[#F3EEE5] hover:text-[#5C4033]"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="shrink-0 text-sm text-[#5C4033]/60">
        {filteredRequests.length} résultat{filteredRequests.length > 1 ? "s" : ""}
      </p>
    </div>
    <div className="overflow-hidden rounded-2xl border border-[#D1965B]/15 bg-white shadow-sm">{loading ? <div className="p-12 text-center text-[#5C4033]/60">Chargement...</div> : requests.length === 0 ? <div className="p-12 text-center text-[#5C4033]/60">Aucune demande.</div> : filteredRequests.length === 0 ? <div className="p-12 text-center"><Search className="mx-auto h-10 w-10 text-[#D1965B]/40" /><p className="mt-3 font-semibold text-[#5C4033]">Aucune demande trouvée</p><p className="mt-1 text-sm text-[#5C4033]/60">Essayez une autre référence ou un autre nom d’activité.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#F8F5EF] text-[#5C4033]"><tr><th className="p-4">Référence</th><th className="p-4">Activité</th><th className="p-4">Demandeur</th><th className="p-4">Département actuel</th><th className="p-4">Statut</th></tr></thead><tbody className="divide-y divide-[#D1965B]/10">{filteredRequests.map((request) => <tr key={request.id} className="hover:bg-[#F8F5EF]/60"><td className="p-4 font-semibold text-[#D1965B]">{request.reference}</td><td className="p-4 font-medium text-[#5C4033]">{request.eventName}</td><td className="p-4 text-[#5C4033]/65">{request.user?.username || request.user?.email || "-"}</td><td className="p-4 text-[#5C4033]/65">{departments[request.assignedDepartment || request.currentDepartment] || request.assignedDepartment}</td><td className="p-4"><RequestStatusBadge status={request.status as never} /></td></tr>)}</tbody></table></div>}</div>
    <Button asChild className="bg-[#D1965B] text-white hover:bg-[#B97D47]"><Link href="/espace-membre/superviseur/utilisateurs"><Users className="mr-2 h-4 w-4" />Gérer les rôles utilisateurs</Link></Button>
  </div>;
}