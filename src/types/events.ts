export interface Event {
  id: number;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  discipline: string;
  public: string;
  description: string;
  image: string;
  capacity?: string;
  featured?: boolean;
  category?: string;
  objective?: string;
  targetAudience?: string;
  impact?: string;
  slogan?: string;
  organizer?: string;
  contact?: string;
  requirements?: string;
  accessibility?: string;
  tags?: string[];
  // Propriétés de compatibilité
  date: string; // Alias pour startDate
  time: string; // Alias pour startTime
}

export interface StrapiEvent {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  discipline: string;
  public: string;
  description: string;
  image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    formats?: Record<string, unknown>;
  } | null;
  capacity?: string;
  featured: boolean;
  category?: string;
  objective?: string;
  targetAudience?: string;
  impact?: string;
  slogan?: string;
  organizer?: string;
  contact?: string;
  requirements?: string;
  accessibility?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface EventFilters {
  month?: string;
  discipline?: string;
  slug?: string;
  public?: string;
  featured?: boolean;
  upcoming?: boolean;
  limit?: number;
  [key: string]: string | boolean | number | undefined;
}

export interface StrapiResponse {
  data: StrapiEvent[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
