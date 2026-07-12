// src/services/actualiteService.ts
import api from "@/lib/api";
import {
  Actualite,
  ActualiteForDownload,
  ActualiteMois,
  ActualiteType,
} from "@/types/actualite";

// =============================================================================
// Type guards
// =============================================================================

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isActualiteLike(obj: unknown): obj is Record<string, unknown> {
  if (!isObject(obj)) return false;
  return (
    "id" in obj ||
    "title" in obj ||
    "slug" in obj ||
    "documentId" in obj
  );
}

// =============================================================================
// Helper to extract image URL from various formats
// =============================================================================

function extractImageUrl(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;

  if (isObject(val)) {
    if (typeof val.url === "string") return val.url;
    const data = val.data;
    if (isObject(data)) {
      if (typeof data.url === "string") return data.url;
      if (isObject(data.attributes) && typeof data.attributes.url === "string") {
        return data.attributes.url;
      }
    }
    const formats = val.formats;
    if (isObject(formats)) {
      for (const key of ["large", "medium", "small", "thumbnail"]) {
        const fmt = formats[key];
        if (isObject(fmt) && typeof fmt.url === "string") return fmt.url;
      }
    }
    if (isArray(val)) {
      const first = val[0];
      if (isObject(first) && typeof first.url === "string") return first.url;
    }
  }

  return "";
}

// =============================================================================
// Field normalizer – maps backend fields to frontend Actualite interface
// =============================================================================

function normalizeActualite(raw: Record<string, unknown>): Actualite {
  return {
    id: String(raw.id ?? raw.documentId ?? ""),
    documentId: String(raw.documentId ?? raw.id ?? ""),
    title: String(raw.title ?? ""),
    slug: String(raw.slug ?? ""),
    type: String(raw.type ?? ""),
    summary: String(raw.summary ?? raw.description ?? ""),
    blocks: [], // You might need to map blocks if your backend returns them
    pdf: undefined, // You can map if needed
    coverImage: extractImageUrl(raw.coverImage ?? raw.image ?? raw.cover),
    mois: String(raw.mois ?? ""),
    annee: raw.annee ? Number(raw.annee) : new Date().getFullYear(),
    pageCount: raw.pageCount ? Number(raw.pageCount) : 0,
    isFeatured: Boolean(raw.isFeatured ?? raw.featured ?? false),
    datePublication: String(raw.datePublication ?? raw.publishedAt ?? raw.createdAt ?? ""),
    createdAt: String(raw.createdAt ?? ""),
    publishedAt: String(raw.publishedAt ?? raw.datePublication ?? ""),
  } as unknown as Actualite;
}

// =============================================================================
// Extract actualites from any API response shape
// =============================================================================

function extractActualites(payload: unknown): Actualite[] {
  if (!payload) return [];

  if (isArray(payload)) {
    if (payload.every((item) => isActualiteLike(item))) {
      return payload.map((item) => normalizeActualite(item as Record<string, unknown>));
    }
    return [];
  }

  if (isObject(payload)) {
    const dataProp = payload.data;
    if (isArray(dataProp) && dataProp.every((item) => isActualiteLike(item))) {
      return dataProp.map((item) => normalizeActualite(item as Record<string, unknown>));
    }
    const itemsProp = payload.items;
    if (isArray(itemsProp) && itemsProp.every((item) => isActualiteLike(item))) {
      return itemsProp.map((item) => normalizeActualite(item as Record<string, unknown>));
    }
  }

  return [];
}

// =============================================================================
// Actualité API functions
// =============================================================================

interface ActualiteFilters {
  type?: ActualiteType;
  annee?: number;
  mois?: ActualiteMois;
  search?: string;
}

export const getActualites = async (
  filters: ActualiteFilters = {}
): Promise<Actualite[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.annee) params.append("annee", String(filters.annee));
    if (filters.mois) params.append("mois", filters.mois);
    if (filters.search) params.append("search", filters.search);

    const url = `/actualites?${params.toString()}`;
    const res = await api.get(url);

    console.log("[getActualites] Status:", res.status);
    console.log("[getActualites] Data type:", typeof res.data);
    console.log("[getActualites] Is array?", Array.isArray(res.data));
    console.log("[getActualites] Sample:", JSON.stringify(res.data).slice(0, 200));

    const actualites = extractActualites(res.data);
    console.log(`[getActualites] Extracted ${actualites.length} actualites`);
    return actualites;
  } catch (error) {
    console.error("getActualites error:", error);
    return [];
  }
};

export const getActualiteBySlug = async (
  slug: string
): Promise<Actualite | null> => {
  try {
    const res = await api.get(`/actualites/${slug}`);
    if (isObject(res.data)) {
      const dataProp = res.data.data;
      if (isArray(dataProp) && dataProp.length > 0) {
        return normalizeActualite(dataProp[0] as Record<string, unknown>);
      }
      if (isActualiteLike(res.data)) {
        return normalizeActualite(res.data as Record<string, unknown>);
      }
    }
    return null;
  } catch (error) {
    console.error("getActualiteBySlug error:", error);
    return null;
  }
};

export const getActualiteForDownload = async (
  id: number
): Promise<ActualiteForDownload | null> => {
  try {
    const res = await api.get(`/actualites/${id}/download`);
    const data = res.data;
    if (isObject(data) && "pdfUrl" in data) {
      return data as unknown as ActualiteForDownload;
    }
    return null;
  } catch (error) {
    console.error("getActualiteForDownload error:", error);
    return null;
  }
};