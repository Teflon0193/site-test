export interface Media {
  id: number;
  title: string;
  description?: string;
  image: string;
  eventDate: string;
  category: string;
  eventType?: string;
  location?: string;
  photographer?: string;
  tags?: string[];
  featured: boolean;
  gallery?: string;
  year?: number;
  month?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    formats?: Record<string, unknown>;
  };
  eventDate: string;
  category: string;
  eventType?: string;
  location?: string;
  photographer?: string;
  tags?: string[];
  featured: boolean;
  gallery?: string;
  year?: number;
  month?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface StrapiMediaResponse {
  data: StrapiMedia[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface MediaFilters {
  search?: string;
  category?: string;
  eventType?: string;
  year?: number;
  month?: number;
  featured?: boolean;
  gallery?: string;
  location?: string;
  photographer?: string;
  tags?: string[];
  limit?: number;
  page?: number;
  sort?: string;
  [key: string]: string | number | boolean | string[] | undefined;
}
