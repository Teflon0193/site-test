// Types pour les espaces du Grand Tambour
export interface Espace {
  id: number;
  nom: string;
  capacite: string;
  caracteristiques: string[];
  image: string;
  iconName: "theater" | "cafe" | "building" | "camera";
}

export const espaces: Espace[] = [
  {
    id: 1,
    nom: "Grand Théâtre",
    capacite: "2000 places",
    caracteristiques: [
      "Grandes représentations",
      "Festivals",
      "Cérémonies nationales",
      "Concerts majeurs",
    ],
    image: "/images/espace3.jpg",
    iconName: "theater",
  },
  {
    id: 2,
    nom: "Petit Théâtre",
    capacite: "800 places",
    caracteristiques: [
      "Pièces contemporaines",
      "Débats",
      "Projections",
      "Performances",
    ],
    image: "/images/espace5.jpg",
    iconName: "theater",
  },
  {
    id: 3,
    nom: "Cafétéria culturelle",
    capacite: "100m²",
    caracteristiques: [
      "Espace de convivialité",
      "Restauration",
      "Petits concerts",
      "Lectures",
    ],
    image: "/images/espace1.jpg",
    iconName: "cafe",
  },
  {
    id: 4,
    nom: "Résidence d'artistes",
    capacite: "100 personnes",
    caracteristiques: [
      "Hébergement",
      "Ateliers de création",
      "Échanges internationaux",
    ],
    image: "/images/espace2.jpg",
    iconName: "building",
  },
  {
    id: 5,
    nom: "Pôle média",
    capacite: "150 personnes",
    caracteristiques: [
      "Production TV, radio, podcasts, éditions",
      "Plateforme de diffusion des créations congolaises et africaines",
    ],
    image: "/images/espace4.jpg",
    iconName: "camera",
  },
];

// Mapping des icônes (séparé des données)
export const iconMap = {
  theater: "FaTheaterMasks",
  cafe: "IoIosCafe",
  building: "FaBuildingUser",
  camera: "FaCamera",
} as const;
