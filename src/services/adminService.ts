export interface AdminRecentMember {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  emailVerified: boolean;
}

export interface AdminStatsResponse {
  totalMembers: number;
  totalActivities: number;
  newMembersThisWeek: number;
  recentMembers: AdminRecentMember[];
}

export type MembersStatusFilter = "all";

export interface MembersQueryParams {
  search?: string;
  status?: MembersStatusFilter;
}

export interface MemberWithActivities {
  id: string;
  name: string | null;
  email: string;
  role: "MEMBER" | "ADMIN";
  emailVerified: boolean;
  createdAt: string;
  _count: {
    activities: number;
  };
}

export interface MembersResponse {
  members: MemberWithActivities[];
  totalMembers: number;
}

export type SuggestionCategory =
  | "PROGRAMMATION"
  | "ACCUEIL"
  | "ESPACES"
  | "COMMUNICATION"
  | "AUTRE";

export type SuggestionStatus = "NEW" | "READ" | "RESOLVED";

export interface AdminSuggestion {
  id: string;
  category: SuggestionCategory;
  message: string;
  status: SuggestionStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface SuggestionsQueryParams {
  status?: SuggestionStatus | "all";
  category?: SuggestionCategory | "all";
}

export interface SuggestionsResponse {
  suggestions: AdminSuggestion[];
  totalSuggestions: number;
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

export async function getSuggestions(
  params: SuggestionsQueryParams
): Promise<SuggestionsResponse> {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `/api/admin/suggestions?${queryString}`
    : "/api/admin/suggestions";

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return handleJsonResponse<SuggestionsResponse>(res);
}

export async function updateSuggestionStatus(
  suggestionId: string,
  status: SuggestionStatus
): Promise<AdminSuggestion> {
  const res = await fetch("/api/admin/suggestions", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ suggestionId, status }),
  });

  return handleJsonResponse<AdminSuggestion>(res);
}
