export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface StrapiHeroSlide {
  id: number;
  documentId: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  image: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    formats?: Record<string, unknown>;
  };
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface StrapiHeroSlideResponse {
  data: StrapiHeroSlide[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
