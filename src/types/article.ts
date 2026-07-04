/**
 * Article editorial du centre (« Articles du centre »).
 *
 * Ces articles sont pour l'instant servis en statique (voir `src/data/articles.ts`)
 * en attendant l'exposition de la feature côté backend Strapi. Le type est pensé
 * pour se rapprocher d'une future réponse CMS afin de limiter la migration.
 */

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  /** Paire question/réponse, pour les articles au format entretien. */
  | { type: "qa"; question: string; answer: string };

export interface Article {
  /** Identifiant d'URL, unique. Utilisé par /articles/[slug]. */
  slug: string;
  title: string;
  /** Résumé court affiché sur les cartes et en tête d'article. */
  excerpt: string;
  /** Rubrique éditoriale (Culture, Patrimoine, Publications, Expositions...). */
  category: string;
  author: string;
  /** Date ISO (YYYY-MM-DD) utilisée pour le tri. */
  date: string;
  /** Libellé de date déjà formaté pour l'affichage en français. */
  dateLabel: string;
  /** Image utilisée sur les cartes et le bloc « à la une » (dans /public). */
  image: string;
  /** Image de couverture de la page de détail. Retombe sur `image` si absente. */
  coverImage?: string;
  /** Temps de lecture estimé, en minutes. */
  readingTime: number;
  /** Mis en avant dans le bloc « À la une ». Un seul article devrait l'être. */
  featured?: boolean;
  content: ArticleBlock[];
}
