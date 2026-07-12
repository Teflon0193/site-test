'use client';

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Mail,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Globe,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProfilePhotoUploader } from "./ProfilePhotoUploader";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// Extend the User type to include all properties used in the component
interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  role?: "MEMBER" | "ADMIN";
  createdAt?: string;
  image?: string;
  emailVerified?: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  newsletterOptIn?: boolean;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const userData = user as ExtendedUser | null;

  useEffect(() => {
    if (!loading && !userData) {
      router.push("/auth/login");
    }
  }, [loading, userData, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!userData) {
    return null;
  }

  const userIsMember = userData.role === "MEMBER" ? "MEMBRE" : "ADMIN";
  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";

  if (userData.role === "ADMIN") {
    router.push("/espace-membre/admin");
    return null;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b">
        <ProfilePhotoUploader
          initialImageUrl={userData.image ?? null} // ✅ fixed
          userName={userData.name || "Utilisateur"}
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {userData.name || "Utilisateur"}
            </h1>
            <div className="flex gap-2">
              <Badge
                variant={userData.emailVerified ? "default" : "secondary"}
                className={cn(
                  "px-2 py-0.5 text-xs font-medium",
                  userData.emailVerified
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                )}
              >
                {userData.emailVerified ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Membre Actif
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Email non vérifié
                  </span>
                )}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium">
                {userIsMember}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Membre depuis le {memberSince}</span>
            </div>
            {userData.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                <span>{userData.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-none shadow-sm bg-white py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <User className="h-5 w-5 text-primary" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Nom complet
                  </p>
                  <p className="text-sm font-medium">{userData.name || "Non renseigné"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{userData.email}</p>
                    {userData.emailVerified && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>

                {userData.phone && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Téléphone
                    </p>
                    <p className="text-sm font-medium">{userData.phone}</p>
                  </div>
                )}

                {userData.address && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Adresse
                    </p>
                    <p className="text-sm font-medium">{userData.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(userData.city || userData.country) && (
            <Card className="border-none shadow-sm bg-white py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="h-5 w-5 text-primary" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userData.city && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ville
                      </p>
                      <p className="text-sm font-medium">{userData.city}</p>
                    </div>
                  )}
                  {userData.country && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pays
                      </p>
                      <p className="text-sm font-medium">{userData.country}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-muted/30 py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Shield className="h-4 w-4 text-primary" />
                État du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-muted/50">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge
                  variant={userData.emailVerified ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    userData.emailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {userData.emailVerified ? "Email vérifié" : "Email non vérifié"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-muted/50">
                <span className="text-sm text-muted-foreground">Rôle</span>
                <span className="text-sm font-medium">{userIsMember}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-muted/50">
                <span className="text-sm text-muted-foreground">
                  Newsletter
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    userData.newsletterOptIn
                      ? "text-green-600"
                      : "text-muted-foreground"
                  )}
                >
                  {userData.newsletterOptIn ? "Abonné" : "Non abonné"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}