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
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProfilePhotoUploader } from "./ProfilePhotoUploader";

export default async function ProfilePage() {
  const user = await getUser();
  const userIsMember = user?.role === "MEMBER" ? "MEMBRE" : "ADMIN";

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === "ADMIN") {
    redirect("/espace-membre/admin");
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b">
        <ProfilePhotoUploader
          initialImageUrl={user.image}
          userName={user.name}
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {user.name}
            </h1>
            <div className="flex gap-2">
              <Badge
                variant={user.emailVerified ? "default" : "secondary"}
                className={cn(
                  "px-2 py-0.5 text-xs font-medium",
                  user.emailVerified
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                )}
              >
                {user.emailVerified ? (
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
            {user.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={14} />
                <span>{user.email}</span>
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
                  <p className="text-sm font-medium">{user.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{user.email}</p>
                    {user.emailVerified && (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                </div>

                {user.phone && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Téléphone
                    </p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                )}

                {user.address && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Adresse
                    </p>
                    <p className="text-sm font-medium">{user.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          {(user.city || user.country) && (
            <Card className="border-none shadow-sm bg-white py-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="h-5 w-5 text-primary" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user.city && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ville
                      </p>
                      <p className="text-sm font-medium">{user.city}</p>
                    </div>
                  )}
                  {user.country && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pays
                      </p>
                      <p className="text-sm font-medium">{user.country}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Account Status */}
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
                  variant={user.emailVerified ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    user.emailVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {user.emailVerified ? "Email vérifié" : "Email non vérifié"}
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
                    user.newsletterOptIn
                      ? "text-green-600"
                      : "text-muted-foreground"
                  )}
                >
                  {user.newsletterOptIn ? "Abonné" : "Non abonné"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
