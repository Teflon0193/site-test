export interface AdminRecentMember {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  isApproved: boolean;
}

export interface AdminStatsResponse {
  totalMembers: number;
  approvedMembers: number;
  pendingMembers: number;
  totalActivities: number;
  newMembersThisWeek: number;
  recentMembers: AdminRecentMember[];
}

export type MembersStatusFilter = "all" | "validated" | "pending";

export interface MembersQueryParams {
  search?: string;
  status?: MembersStatusFilter;
}

export interface MemberWithActivities {
  id: string;
  name: string | null;
  email: string;
  role: "MEMBER" | "ADMIN";
  isApproved: boolean;
  createdAt: string;
  _count: {
    activities: number;
  };
}

export interface MembersResponse {
  members: MemberWithActivities[];
  totalMembers: number;
  approvedMembers: number;
  pendingMembers: number;
}

export interface PendingUser {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  phone: string | null;
}

export interface ApprovalsResponse {
  pendingUsers: PendingUser[];
  approvedCount: number;
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text || `Erreur API admin (${res.status} ${res.statusText})`
    );
  }
  return (await res.json()) as T;
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  const res = await fetch("/api/admin/stats", {
    method: "GET",
    cache: "no-store",
  });
  return handleJsonResponse<AdminStatsResponse>(res);
}

export async function getMembers(
  params: MembersQueryParams
): Promise<MembersResponse> {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `/api/admin/members?${queryString}`
    : "/api/admin/members";

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return handleJsonResponse<MembersResponse>(res);
}

export async function getPendingApprovals(): Promise<ApprovalsResponse> {
  const res = await fetch("/api/admin/approvals", {
    method: "GET",
    cache: "no-store",
  });
  return handleJsonResponse<ApprovalsResponse>(res);
}
