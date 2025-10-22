import { useState, useEffect } from "react";
import { getFilteredEvents } from "@/services/eventService";
import { Event } from "@/types/events";

export interface FilterState {
  month: string;
  discipline: string;
  public: string;
}

/**
 * Hook pour filtrer les événements côté Strapi avec cache
 *
 * @returns {Object} État des filtres, événements filtrés, loading, erreur et fonctions de gestion
 */
export const useEventFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    month: "Tous",
    discipline: "Tous",
    public: "Tous",
  });

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Met à jour un filtre spécifique
   */
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Remet tous les filtres à leur valeur par défaut
   */
  const clearFilters = () => {
    setFilters({
      month: "Tous",
      discipline: "Tous",
      public: "Tous",
    });
  };

  /**
   * Charge les événements filtrés depuis Strapi quand les filtres changent
   */
  useEffect(() => {
    const loadFilteredEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const events = await getFilteredEvents(filters);
        setFilteredEvents(events);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des événements";

        setError(errorMessage);
        console.error("Erreur filtres:", err);

        // En cas d'erreur, on vide la liste plutôt que de garder d'anciennes données
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilteredEvents();
  }, [filters]);

  /**
   * Vérifie si des filtres sont actifs (différents de "Tous")
   */
  const hasActiveFilters =
    filters.month !== "Tous" ||
    filters.discipline !== "Tous" ||
    filters.public !== "Tous";

  return {
    // État
    filters,
    filteredEvents,
    loading,
    error,

    // Actions
    updateFilter,
    clearFilters,

    // Computed
    hasActiveFilters,

    // Stats utiles
    eventCount: filteredEvents.length,
  };
};
