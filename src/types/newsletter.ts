export type Mois =
  | "Janvier"
  | "Février"
  | "Mars"
  | "Avril"
  | "Mai"
  | "Juin"
  | "Juillet"
  | "Août"
  | "Septembre"
  | "Octobre"
  | "Novembre"
  | "Décembre";

export interface Newsletter {
  id: number;
  title: string;
  edition: string;
  mois: Mois;
  annee: number;
  description: string;
  pdf: {
    url: string;
    name: string;
    size: number;
    ext: string;
  };
  coverImage?: string;
  pageCount?: number;
  isFeatured: boolean;
  datePublication?: string;
  createdAt: string;
  publishedAt: string;
}

export interface StrapiNewsletter {
  id: number;
  documentId: string;
  title: string;
  edition: string;
  mois: Mois;
  annee: number;
  description: string;
  pdf: {
    id: number;
    documentId: string;
    name: string;
    url: string;
    size: number;
    ext: string;
  };
  coverImage?: {
    id: number;
    url: string;
    formats?: {
      medium?: { url: string };
      [key: string]: { url?: string } | undefined;
    };
  } | null;
  pageCount?: number;
  isFeatured: boolean;
  datePublication?: string;
  createdAt: string;
  publishedAt: string;
}
