// Fonction pour formater les dates en français
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

// Constantes pour les filtres
export const MEDIA_CATEGORIES = [
  "Tous",
  "Concert",
  "Danse",
  "Théâtre",
  "Exposition",
  "Atelier",
  "Littérature",
  "Cinéma",
  "Festival",
  "Conférence",
  "Autre",
] as const;

export const EVENT_TYPES = [
  "Tous",
  "Culturel",
  "Éducatif",
  "Social",
  "Artistique",
  "Traditionnel",
] as const;

export const MONTHS = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
] as const;

// Générer les années (5 dernières années)
export const generateYears = (count: number = 5): number[] => {
  return Array.from({ length: count }, (_, i) => new Date().getFullYear() - i);
};

// Constantes de pagination
export const ITEMS_PER_PAGE = 12;
