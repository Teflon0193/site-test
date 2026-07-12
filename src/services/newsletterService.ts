// src/services/newsletterService.ts
import api from "@/lib/api";
import { Newsletter } from "@/types/newsletter";

/**
 * Récupère toutes les newsletters depuis le backend Express
 */
export const getNewsletters = async (): Promise<Newsletter[]> => {
  const res = await api.get("/newsletters");
  return res.data; // Express retourne un tableau de Newsletter
};

/**
 * Récupère la newsletter mise en avant
 */
export const getFeaturedNewsletter = async (): Promise<Newsletter | null> => {
  try {
    const res = await api.get("/newsletters/featured");
    return res.data || null;
  } catch (error) {
    console.error("[Newsletter Service] Error fetching featured newsletter:", error);
    return null;
  }
};

/**
 * Récupère une newsletter par son ID
 */
export const getNewsletterById = async (
  id: number
): Promise<Newsletter | null> => {
  try {
    const res = await api.get(`/newsletters/${id}`);
    return res.data;
  } catch (error) {
    console.error("[Newsletter Service] Error fetching newsletter by id:", error);
    return null;
  }
};