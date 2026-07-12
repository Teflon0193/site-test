// src/services/eventService.ts
import api from "@/lib/api";
import { Event, EventFilters, EventWithRegistrations } from "@/types/events";

// =============================================================================
// Type guards
// =============================================================================

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isEventLike(obj: unknown): obj is Record<string, unknown> {
  if (!isObject(obj)) return false;
  return (
    "id" in obj ||
    "title" in obj ||
    "slug" in obj ||
    "startDate" in obj ||
    "start_date" in obj
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
// Field normalizer
// =============================================================================

function normalizeEvent(raw: Record<string, unknown>): Event {
  return {
    id: String(raw.id ?? raw.ID ?? ""),
    title: String(raw.title ?? raw.name ?? ""),
    slug: String(raw.slug ?? ""),
    description: String(raw.description ?? raw.desc ?? raw.content ?? ""),
    discipline: String(raw.discipline ?? raw.category ?? ""),
    public: String(raw.public ?? raw.audience ?? raw.public_target ?? ""),
    startDate: String(raw.startDate ?? raw.start_date ?? raw.date ?? ""),
    endDate: String(raw.endDate ?? raw.end_date ?? ""),
    startTime: String(raw.startTime ?? raw.start_time ?? raw.time ?? ""),
    endTime: String(raw.endTime ?? raw.end_time ?? ""),
    location: String(raw.location ?? raw.place ?? ""),
    image: extractImageUrl(raw.image ?? raw.image_url ?? raw.coverImage ?? raw.cover),
    date: String(raw.date ?? raw.startDate ?? raw.start_date ?? ""),
    time: String(raw.time ?? raw.startTime ?? raw.start_time ?? ""),
  } as unknown as Event;
}

// =============================================================================
// Extract events from any API response shape
// =============================================================================

function extractEvents(payload: unknown): Event[] {
  if (!payload) return [];

  if (isArray(payload)) {
    if (payload.every((item) => isEventLike(item))) {
      return payload.map((item) => normalizeEvent(item as Record<string, unknown>));
    }
    return [];
  }

  if (isObject(payload)) {
    const dataProp = payload.data;
    if (isArray(dataProp) && dataProp.every((item) => isEventLike(item))) {
      return dataProp.map((item) => normalizeEvent(item as Record<string, unknown>));
    }
    const eventsProp = payload.events;
    if (isArray(eventsProp) && eventsProp.every((item) => isEventLike(item))) {
      return eventsProp.map((item) => normalizeEvent(item as Record<string, unknown>));
    }
    const itemsProp = payload.items;
    if (isArray(itemsProp) && itemsProp.every((item) => isEventLike(item))) {
      return itemsProp.map((item) => normalizeEvent(item as Record<string, unknown>));
    }
  }

  return [];
}

// =============================================================================
// Main fetch function
// =============================================================================

const fetchEvents = async (filters: EventFilters = {}): Promise<Event[]> => {
  try {
    const params = new URLSearchParams();

    if (filters.featured !== undefined) {
      params.append("featured", String(filters.featured));
    }
    if (filters.upcoming !== undefined) {
      params.append("upcoming", String(filters.upcoming));
    }
    if (filters.limit) {
      params.append("limit", String(filters.limit));
    }
    if (filters.month) {
      params.append("month", String(filters.month));
    }
    if (filters.discipline) {
      params.append("discipline", String(filters.discipline));
    }
    if (filters.public) {
      params.append("public", String(filters.public));
    }
    if (filters.category) {
      params.append("category", String(filters.category));
    }
    if (filters.slug) {
      params.append("slug", String(filters.slug));
    }

    const url = `/agenda?${params.toString()}`;
    const res = await api.get(url);
    const events = extractEvents(res.data);
    return events;
  } catch (error) {
    console.error("fetchEvents error:", error);
    return [];
  }
};

// =============================================================================
// Public API – ALL EXPORTS
// =============================================================================

export const getEvents = async (): Promise<Event[]> => fetchEvents();

export const getFeaturedEvents = async (): Promise<Event[]> =>
  fetchEvents({ featured: true });

export const getUpcomingEvents = async (limit?: number): Promise<Event[]> =>
  fetchEvents({ upcoming: true, limit });

export const getFilteredEvents = async (filters: {
  month: string;
  discipline: string;
  publicTarget: string;
}): Promise<Event[]> => {
  return fetchEvents({
    month: filters.month,
    discipline: filters.discipline,
    public: filters.publicTarget,
  });
};

export const getEventBySlug = async (slug: string): Promise<Event[] | []> => {
  try {
    const res = await api.get(`/agenda/${slug}`);
    if (isObject(res.data)) {
      const dataProp = res.data.data;
      if (isArray(dataProp) && dataProp.length > 0) {
        return [normalizeEvent(dataProp[0] as Record<string, unknown>)];
      }
    }
    if (isEventLike(res.data)) {
      return [normalizeEvent(res.data as Record<string, unknown>)];
    }
    return [];
  } catch (error) {
    console.error("getEventBySlug error:", error);
    return [];
  }
};

export const getEventsByDiscipline = async (discipline: string): Promise<Event[]> =>
  fetchEvents({ discipline });

export const getEventsByCategory = async (category: string): Promise<Event[]> =>
  fetchEvents({ category });

/**
 * Admin: get events with registrations (calls Next.js API route)
 */
export const getEventsWithRegistrations = async (): Promise<EventWithRegistrations[]> => {
  try {
    const res = await fetch("/api/admin/events", {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `API admin error: ${res.status}`);
    }
    const data = await res.json();
    return data.events || [];
  } catch (error) {
    console.error("getEventsWithRegistrations error:", error);
    return [];
  }
};