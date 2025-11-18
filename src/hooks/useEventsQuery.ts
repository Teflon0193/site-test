"use client";

import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/types/events";
import type { FilterState } from "./useEventFilters";
import {
  getEvents,
  getFeaturedEvents,
  getUpcomingEvents,
  getFilteredEvents,
} from "@/services/eventService";

export const useAllEventsQuery = () =>
  useQuery<Event[], Error>({
    queryKey: ["events", "all"],
    queryFn: () => getEvents(),
  });

export const useFeaturedEventsQuery = () =>
  useQuery<Event[], Error>({
    queryKey: ["events", "featured"],
    queryFn: () => getFeaturedEvents(),
  });

export const useUpcomingEventsQuery = (limit?: number) =>
  useQuery<Event[], Error>({
    queryKey: ["events", "upcoming", { limit }],
    queryFn: () => getUpcomingEvents(limit),
  });

export const useFilteredEventsQuery = (filters: FilterState) =>
  useQuery<Event[], Error>({
    queryKey: ["events", "list", filters],
    queryFn: () => getFilteredEvents(filters),
  });
