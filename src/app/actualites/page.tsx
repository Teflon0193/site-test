import { getUser } from "@/lib/auth-server";
import { getActualites } from "@/services/actualiteService";
import ActualitesPageClient from "./ActualitesPageClient";
import MainLayout from "../components/layouts/MainLayout";

export const metadata = {
  title: "Actualites CCAPAC - Newsletters, communiques et points de presse",
  description:
    "Retrouvez les newsletters, communiques et annonces de points de presse du CCAPAC.",
};

export default async function ActualitesPage() {
  const [actualites, user] = await Promise.all([getActualites(), getUser()]);

  return (
    <MainLayout>
      <ActualitesPageClient
        actualites={actualites}
        isAuthenticated={Boolean(user)}
      />
    </MainLayout>
  );
}
