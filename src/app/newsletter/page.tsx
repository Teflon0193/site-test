import { getNewsletters } from "@/services/newsletterService";
import { getUser } from "@/lib/auth-server";
import NewsletterPageClient from "@/app/newsletter/NewsletterPageClient";

export const metadata = {
  title: "Newsletters CCAPAC - Les faits marquants mensuels",
  description:
    "Découvrez nos éditions mensuelles recensant les moments forts du Centre Culturel",
};

export default async function NewsletterPage() {
  const [newsletters, user] = await Promise.all([
    getNewsletters(),
    getUser(),
  ]);


  return (
    <NewsletterPageClient
      newsletters={newsletters}
      isAuthenticated={!!user}
    />
  );
}
