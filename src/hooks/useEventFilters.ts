import { useState, useEffect } from "react";
import { getFilteredEvents } from "@/services/eventService";
import { Event } from "@/types/events";
import { DEFAULT_FILTER_VALUE } from "@/data/events";

export interface FilterState {
  month: string;
  discipline: string;
  publicTarget: string;
}

/**
 * Hook pour filtrer les événements côté Strapi avec cache
 *
 * @returns {Object} État des filtres, événements filtrés, loading, erreur et fonctions de gestion
 */
export const useEventFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    month: DEFAULT_FILTER_VALUE,
    discipline: DEFAULT_FILTER_VALUE,
    publicTarget: DEFAULT_FILTER_VALUE,
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
      month: DEFAULT_FILTER_VALUE,
      discipline: DEFAULT_FILTER_VALUE,
      publicTarget: DEFAULT_FILTER_VALUE,
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
   * Vérifie si des filtres sont actifs (différents de la valeur par défaut)
   */
  const hasActiveFilters =
    filters.month !== DEFAULT_FILTER_VALUE ||
    filters.discipline !== DEFAULT_FILTER_VALUE ||
    filters.publicTarget !== DEFAULT_FILTER_VALUE;

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
