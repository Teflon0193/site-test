// src/services/mediaService.ts
import api from "@/lib/api";
import { Media, MediaFilters } from "@/types/media";

// =============================================================================
// Type guards
// =============================================================================

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isMediaLike(obj: unknown): obj is Record<string, unknown> {
  if (!isObject(obj)) return false;
  return "id" in obj || "name" in obj || "formats" in obj;
}

// =============================================================================
// Helper: check if URL is an image
// =============================================================================

function isImageUrl(url: string): boolean {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico'];
  const lower = url.toLowerCase();
  return imageExtensions.some(ext => lower.endsWith(ext));
}

// =============================================================================
// Image URL extraction – handles both array and object formats
// =============================================================================

function extractImageUrl(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;

  if (isObject(val)) {
    // Direct 'url' property
    if (typeof val.url === "string") return val.url;

    // Formats as an array: [ { url: ... }, ... ]
    const formats = val.formats;
    if (isArray(formats) && formats.length > 0) {
      const first = formats[0];
      if (isObject(first) && typeof first.url === "string") return first.url;
    }

    // Formats as an object: { large: { url }, medium: { url } }
    if (isObject(formats)) {
      for (const key of ["large", "medium", "small", "thumbnail"]) {
        const fmt = formats[key];
        if (isObject(fmt) && typeof fmt.url === "string") return fmt.url;
      }
    }

    // Nested Strapi style: { data: { attributes: { url } } }
    const data = val.data;
    if (isObject(data)) {
      if (typeof data.url === "string") return data.url;
      if (isObject(data.attributes) && typeof data.attributes.url === "string") {
        return data.attributes.url;
      }
    }

    // If val itself is an array of objects
    if (isArray(val)) {
      const first = val[0];
      if (isObject(first) && typeof first.url === "string") return first.url;
    }
  }

  return "";
}

// =============================================================================
// Normalise media item
// =============================================================================

function normalizeMedia(raw: Record<string, unknown>): Media {
  // Extract image URL from formats array or object
  let imageUrl = "";
  const formats = raw.formats;

  if (isArray(formats) && formats.length > 0) {
    const first = formats[0];
    if (isObject(first) && typeof first.url === "string") {
      imageUrl = first.url;
    }
  } else if (isObject(formats)) {
    for (const key of ["large", "medium", "small", "thumbnail"]) {
      const fmt = formats[key];
      if (isObject(fmt) && typeof fmt.url === "string") {
        imageUrl = fmt.url;
        break;
      }
    }
  }

  // Fallback: if no formats, try other fields
  if (!imageUrl) {
    imageUrl = extractImageUrl(raw.image ?? raw.url ?? raw.coverImage ?? raw.cover);
  }

  // If the URL is not an image (e.g., PDF), or is empty, use a placeholder
  if (!imageUrl || !isImageUrl(imageUrl)) {
    console.log(`[normalizeMedia] Non-image URL or empty, using placeholder: ${imageUrl}`);
    // Use a static placeholder image from public folder
    imageUrl = "/images/placeholder.jpg";
  }

  const media: Media = {
    id: String(raw.id ?? raw.ID ?? ""),
    title: String(raw.name ?? raw.title ?? ""),
    description: String(raw.alternative_text ?? raw.description ?? raw.caption ?? ""),
    image: imageUrl,
    category: String(raw.category ?? ""),
    eventType: String(raw.eventType ?? raw.event_type ?? ""),
    year: Number(raw.year ?? new Date().getFullYear()),
    month: Number(raw.month ?? 0),
    gallery: String(raw.gallery ?? ""),
    location: String(raw.location ?? ""),
    photographer: String(raw.photographer ?? ""),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    featured: Boolean(raw.featured ?? false),
    eventDate: String(raw.eventDate ?? raw.event_date ?? ""),
    createdAt: String(raw.createdAt ?? raw.created_at ?? raw.uploadedAt ?? ""),
  } as unknown as Media;

  return media;
}

// =============================================================================
// Extract media array
// =============================================================================

function extractMedia(payload: unknown): Media[] {
  if (!payload) {
    console.warn("[extractMedia] No payload");
    return [];
  }
  console.log("[extractMedia] Raw payload type:", typeof payload);
  console.log("[extractMedia] Is array?", Array.isArray(payload));
  console.log("[extractMedia] Sample:", JSON.stringify(payload).slice(0, 200));

  if (isArray(payload)) {
    if (payload.every((item) => isMediaLike(item))) {
      const result = payload.map((item) => normalizeMedia(item as Record<string, unknown>));
      console.log(`[extractMedia] Extracted ${result.length} items from array`);
      return result;
    }
    console.warn("[extractMedia] Array items are not Media-like");
    return [];
  }

  if (isObject(payload)) {
    const dataProp = payload.data;
    if (isArray(dataProp) && dataProp.every((item) => isMediaLike(item))) {
      const result = dataProp.map((item) => normalizeMedia(item as Record<string, unknown>));
      console.log(`[extractMedia] Extracted ${result.length} items from data property`);
      return result;
    }
    const itemsProp = payload.items;
    if (isArray(itemsProp) && itemsProp.every((item) => isMediaLike(item))) {
      const result = itemsProp.map((item) => normalizeMedia(item as Record<string, unknown>));
      console.log(`[extractMedia] Extracted ${result.length} items from items property`);
      return result;
    }
    const mediaProp = payload.media;
    if (isArray(mediaProp) && mediaProp.every((item) => isMediaLike(item))) {
      const result = mediaProp.map((item) => normalizeMedia(item as Record<string, unknown>));
      console.log(`[extractMedia] Extracted ${result.length} items from media property`);
      return result;
    }
    console.warn("[extractMedia] No matching property found in payload", Object.keys(payload));
    return [];
  }

  return [];
}

// =============================================================================
// Build query string
// =============================================================================

const buildMediaQuery = (filters: MediaFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category && filters.category !== "Tous") params.append("category", filters.category);
  if (filters.eventType && filters.eventType !== "Tous") params.append("eventType", filters.eventType);
  if (filters.year) params.append("year", String(filters.year));
  if (filters.month) params.append("month", String(filters.month));
  if (filters.gallery) params.append("gallery", filters.gallery);
  if (filters.location) params.append("location", filters.location);
  if (filters.photographer) params.append("photographer", filters.photographer);
  if (filters.tags && filters.tags.length) filters.tags.forEach(t => params.append("tags", t));
  if (filters.featured !== undefined) params.append("featured", String(filters.featured));
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.page) params.append("page", String(filters.page));
  return params;
};

// =============================================================================
// Main fetch function
// =============================================================================

const fetchMedia = async (filters: MediaFilters = {}): Promise<Media[]> => {
  try {
    const params = buildMediaQuery(filters);
    const url = `/galleries?${params.toString()}`;
    console.log("[fetchMedia] Requesting:", url);
    const res = await api.get(url);
    console.log("[fetchMedia] Response status:", res.status);
    console.log("[fetchMedia] Response data type:", typeof res.data);
    const extracted = extractMedia(res.data);
    console.log(`[fetchMedia] Final extracted: ${extracted.length} items`);
    if (extracted.length > 0) {
      console.log("[fetchMedia] First item image URL:", extracted[0].image);
    }
    return extracted;
  } catch (error) {
    console.error("[fetchMedia] Error:", error);
    return [];
  }
};

// =============================================================================
// Exported functions
// =============================================================================

export const getMedia = async (filters?: MediaFilters): Promise<Media[]> =>
  fetchMedia(filters);

export const getFeaturedMedia = async (): Promise<Media[]> =>
  fetchMedia({ featured: true });

export const getMediaByCategory = async (category: string): Promise<Media[]> =>
  fetchMedia({ category });

export const getMediaByYear = async (year: number): Promise<Media[]> =>
  fetchMedia({ year });

export const getMediaByGallery = async (gallery: string): Promise<Media[]> =>
  fetchMedia({ gallery });