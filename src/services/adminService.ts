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

export type FundraisingDonationStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export type FundraisingPaymentMethod = "stripe" | "paypal" | "pawapay";

export interface FundraisingQueryParams {
  status?: FundraisingDonationStatus | "all";
  payment_method?: FundraisingPaymentMethod | "all";
}

export interface AdminFundraisingDonation {
  id: string;
  amount: number;
  currency: string;
  status: FundraisingDonationStatus;
  payment_method: FundraisingPaymentMethod;
  payment_method_label: string;
  donor: {
    name: string;
    email: string;
    phone?: string;
    is_anonymous?: boolean;
  };
  created_at: string;
  updated_at: string;
  succeeded_at: string | null;
  notification_status: FundraisingNotificationStatus;
  notified_at: string | null;
  donor_notification_status: FundraisingNotificationStatus;
  donor_notified_at: string | null;
  donor_is_member: boolean | null;
}

export type FundraisingNotificationStatus =
  | "none"
  | "pending"
  | "sending"
  | "sent"
  | "failed"
  | "skipped";

export interface AdminFundraisingResponse {
  campaign: {
    id: string;
    title: string;
    status: string;
    goal_amount: number;
    currency: string;
  };
  stats: {
    raised_amount: number;
    progress_percent: number;
    succeeded_donations_count: number;
    unique_donors_count: number;
    pending_donations_count: number;
  };
  donations: AdminFundraisingDonation[];
  has_more: boolean;
  next_cursor: string | null;
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

export async function getFundraisingAdminData(
  params: FundraisingQueryParams
): Promise<AdminFundraisingResponse> {
  const searchParams = new URLSearchParams();

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params.payment_method && params.payment_method !== "all") {
    searchParams.set("payment_method", params.payment_method);
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `/api/admin/fundraising?${queryString}`
    : "/api/admin/fundraising";

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return handleJsonResponse<AdminFundraisingResponse>(res);
}
