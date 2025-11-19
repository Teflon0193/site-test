import { useQuery } from "@tanstack/react-query";
import {
  getAdminStats,
  getMembers,
  getPendingApprovals,
  type AdminStatsResponse,
  type MembersQueryParams,
  type MembersResponse,
  type ApprovalsResponse,
} from "@/services/adminService";

export const useAdminStatsQuery = () =>
  useQuery<AdminStatsResponse, Error>({
    queryKey: ["admin", "stats", "upcomingEvents"],
    queryFn: () => getAdminStats(),
    // Dashboard: données fraîches mais sans spammer le serveur
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000,
  });

export const useMembersQuery = (params: MembersQueryParams) =>
  useQuery<MembersResponse, Error>({
    queryKey: ["admin", "members", params],
    queryFn: () => getMembers(params),
    // Ne pas rafraîchir trop agressivement la liste pendant que l’admin travaille
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

export const usePendingApprovalsQuery = () =>
  useQuery<ApprovalsResponse, Error>({
    queryKey: ["admin", "approvals"],
    queryFn: () => getPendingApprovals(),
    // File d’attente des demandes : on veut des données assez fraîches
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 15 * 1000,
  });
