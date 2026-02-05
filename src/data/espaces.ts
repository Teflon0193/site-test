// Types pour les espaces du Grand Tambour
export interface Espace {
  id: number;
  nom: string;
  capacite: string;
  description: string;
  caracteristiques: string[];
  image: string;
  iconName: "theater" | "cafe" | "building" | "camera";
}

export const espaces: Espace[] = [
  {
    id: 1,
    nom: "Grand Théâtre",
    capacite: "2000 places",
    description:
      "Une salle de spectacle majestueuse aux normes internationales, conçue pour accueillir les plus grands événements culturels du continent.",
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
    description:
      "Un espace intimiste idéal pour le théâtre contemporain, les débats d'idées et les performances artistiques expérimentales.",
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
    description:
      "Le cœur battant du forum, un lieu d'échange et de convivialité où la gastronomie rencontre la littérature et la musique vivante.",
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
    description:
      "Une structure d'hébergement et de création favorisant les échanges interculturels et le développement de nouveaux langages artistiques.",
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
    description:
      "Un centre de production multimédia de pointe pour la diffusion des cultures congolaises et africaines dans le monde numérique.",
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
