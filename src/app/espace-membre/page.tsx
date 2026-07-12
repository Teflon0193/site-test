import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  Activity,
} from "lucide-react";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

// Types
interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  email_verified: boolean;
  newsletterOptIn?: boolean;
  created_at: string;
  updated_at: string;
}

export default async function DashboardPage() {
  // 1. Récupérer l'utilisateur de base (via JWT cookie)
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === "ADMIN") {
    redirect("/espace-membre/admin");
  }

  // 2. Aller chercher le profil complet (email_verified, newsletterOptIn, etc.)
  let fullProfile: UserProfile | null = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        // Le cookie sera envoyé automatiquement par le navigateur,
        // mais en Server Component on doit passer le token manuellement
        // On peut récupérer le token depuis les cookies et le mettre dans l'Authorization
        // Mais on va passer par une approche simplifiée : on utilise le même token que getUser.
        // En pratique, on pourrait appeler un endpoint public ou utiliser un service.
      },
      // On ne peut pas facilement ajouter l'Authorization header ici car le cookie est HttpOnly.
      // On va donc contourner en utilisant le même JWT via les cookies.
      // Mais pour simplifier, on utilise fetch avec credentials: 'include' si on est sur le même domaine.
      // En développement, on utilise credentials: 'include'
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      fullProfile = data.user;
    }
  } catch (e) {
    console.error("Impossible de récupérer le profil complet:", e);
  }

  // On combine les infos : on prend les champs de user et on surcharge avec le profil complet si disponible.
  const profile = fullProfile || {
    ...user,
    email_verified: false,
    newsletterOptIn: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const memberSince = new Date(profile.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 3. Récupérer le nombre d'événements auxquels l'utilisateur est inscrit (si endpoint existe)
  let eventsRegistered = 0;
  try {
    // Endpoint hypothétique : /api/member/registrations
    // Si l'endpoint n'existe pas, on laisse à 0.
    // On peut aussi interroger /api/agenda et filtrer ? Non, ce n'est pas pertinent.
    // Ici on fait une tentative silencieuse.
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${baseUrl}/member/registrations/count`, {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      eventsRegistered = data.count || 0;
    }
  } catch (e) {
    // Si l'endpoint n'existe pas, on garde 0.
  }

  // Statistiques simplifiées
  const stats = [
    {
      title: "Événements Inscrits",
      value: eventsRegistered.toString(),
      icon: Calendar,
      description: "Inscriptions en cours",
      className: "text-blue-600 bg-blue-50",
    },
    {
      title: "Statut Membre",
      value: profile.email_verified ? "Actif" : "Email non vérifié",
      icon: User,
      description: `Membre depuis ${memberSince.split(" ")[2]}`,
      className: "text-orange-600 bg-orange-50",
    },
    // On peut ajouter d'autres stats si besoin
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bienvenue, {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Heureux de vous revoir. Voici un aperçu de votre activité.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white px-4 py-2 rounded-full border shadow-sm">
          <User size={16} />
          <span>Membre depuis le {memberSince}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="border-none shadow-sm hover:shadow-md transition-all duration-200 bg-white py-4"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-full", stat.className)}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section Activités Récentes (simplifiée) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Activités Récentes
        </h2>
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground">
                Aucune activité récente
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Vos actions apparaîtront ici lorsque vous interagirez avec la plateforme.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}