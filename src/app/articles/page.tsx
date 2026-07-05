import type { Metadata } from "next";
import MainLayout from "../components/layouts/MainLayout";
import ArticlesPageClient from "./ArticlesPageClient";
import { articles, getArticleCategories } from "@/data/articles";

export const metadata: Metadata = {
  title: "Articles du centre - CCAPAC",
  description:
    "Reportages, analyses et récits du Centre Culturel et Artistique pour les Pays d'Afrique Centrale : expositions, patrimoine, culture et publications.",
};

export default function ArticlesPage() {
  return (
    <MainLayout>
      <ArticlesPageClient
        articles={articles}
        categories={getArticleCategories()}
      />
    </MainLayout>
  );
}
