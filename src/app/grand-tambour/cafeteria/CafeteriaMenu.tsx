"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";

type MenuItem = {
  name: string;
  description: string;
  price: string;
  badge?: string;
};

type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

const MENU: MenuCategory[] = [
  {
    id: "petit-dejeuner",
    label: "Petit-déjeuner",
    items: [
      {
        name: "Omelette Kinoise",
        description: "Œufs fermiers, tomates, oignons et pili-pili doux.",
        price: "6 000 FC",
        badge: "Recommandé",
      },
      {
        name: "Pain perdu & miel",
        description: "Pain artisanal doré, miel local et fruits de saison.",
        price: "5 500 FC",
      },
      {
        name: "Bouillie de mil",
        description: "Préparation traditionnelle onctueuse, servie chaude.",
        price: "4 000 FC",
      },
      {
        name: "Café & viennoiserie",
        description: "Café Arabica du Kivu accompagné d'une viennoiserie.",
        price: "5 000 FC",
      },
    ],
  },
  {
    id: "dejeuner",
    label: "Déjeuner",
    items: [
      {
        name: "Poulet Moambe & fufu",
        description: "Le grand classique congolais, sauce moambe et pondu.",
        price: "15 000 FC",
        badge: "Populaire",
      },
      {
        name: "Liboke de capitaine",
        description: "Poisson capitaine en papillote, épices locales.",
        price: "20 000 FC",
      },
      {
        name: "Riz, haricots & viande",
        description: "Assiette complète et généreuse, sauce maison.",
        price: "12 000 FC",
      },
      {
        name: "Salade du Centre",
        description: "Légumes frais du marché, vinaigrette au gingembre.",
        price: "9 000 FC",
      },
    ],
  },
  {
    id: "diner",
    label: "Dîner",
    items: [
      {
        name: "Brochettes & plantain",
        description: "Brochettes grillées et bananes plantain frites.",
        price: "14 000 FC",
      },
      {
        name: "Poisson braisé",
        description: "Poisson entier braisé, accompagnement au choix.",
        price: "18 000 FC",
        badge: "Chef",
      },
      {
        name: "Madesu (haricots)",
        description: "Haricots mijotés à la congolaise, riz ou chikwangue.",
        price: "10 000 FC",
      },
      {
        name: "Soupe du jour",
        description: "Préparation maison selon l'arrivage du marché.",
        price: "7 000 FC",
      },
    ],
  },
  {
    id: "boissons",
    label: "Boissons",
    items: [
      {
        name: "Jus de gingembre (tangawisi)",
        description: "Jus frais maison, vif et parfumé.",
        price: "4 000 FC",
      },
      {
        name: "Jus de bissap",
        description: "Infusion d'hibiscus glacée, légèrement sucrée.",
        price: "4 000 FC",
      },
      {
        name: "Café Arabica du Kivu",
        description: "Café de spécialité torréfié artisanalement.",
        price: "5 000 FC",
        badge: "Recommandé",
      },
      {
        name: "Thés & infusions",
        description: "Sélection de thés et infusions locales.",
        price: "3 500 FC",
      },
    ],
  },
];

export default function CafeteriaMenu() {
  const [activeId, setActiveId] = useState(MENU[0].id);
  const active = MENU.find((category) => category.id === activeId) ?? MENU[0];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {MENU.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`rounded-full px-6 py-3 text-sm font-bold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-[#f4efe4] text-primary hover:bg-primary/10"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        {active.items.map((item) => (
          <div key={item.name} className="flex items-center gap-5">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-[#eadcc7] bg-[#fdf6e9] text-secondary">
              <Utensils className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <h4 className="text-lg font-bold text-primary">{item.name}</h4>
                <span className="shrink-0 font-bold text-secondary">
                  {item.price}
                </span>
              </div>
              <p className="text-sm italic leading-relaxed text-primary/65">
                {item.description}
              </p>
              {item.badge && (
                <span className="mt-2 inline-block rounded bg-[#ffcc02]/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7a5a12]">
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
