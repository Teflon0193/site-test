import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";

interface ValidatePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ValidateTokenPage({ params }: ValidatePageProps) {
  const { token } = await params;

  let status: "success" | "expired" | "invalid" | "used" = "invalid";
  let userName = "";

  try {
    // Récupérer le token
    const approvalToken = await prisma.approvalToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!approvalToken) {
      status = "invalid";
    } else if (approvalToken.used) {
      status = "used";
    } else if (new Date() > approvalToken.expiresAt) {
      status = "expired";
    } else {
      // Token valide, activer le compte
      await prisma.user.update({
        where: { id: approvalToken.userId },
        data: { isApproved: true },
      });

      // Marquer le token comme utilisé
      await prisma.approvalToken.update({
        where: { id: approvalToken.id },
        data: { used: true },
      });

      status = "success";
      userName = approvalToken.user.name;
    }
  } catch (error) {
    console.error("Erreur validation token:", error);
    status = "invalid";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-4">
        <CardHeader className="text-center pb-6">
          {status === "success" && (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-green-600">
                Compte activé !
              </CardTitle>
            </>
          )}

          {status === "used" && (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-blue-600">
                Déjà activé
              </CardTitle>
            </>
          )}

          {(status === "expired" || status === "invalid") && (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-red-600">
                {status === "expired" ? "Lien expiré" : "Lien invalide"}
              </CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {status === "success" && (
            <>
              <p className="text-center text-muted-foreground">
                Félicitations{" "}
                <strong className="text-foreground">{userName}</strong> ! Votre
                compte CCAPAC est maintenant actif.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ Vous pouvez maintenant accéder à tous les services réservés
                  aux membres :
                </p>
                <ul className="mt-2 text-sm text-green-700 space-y-1 ml-4">
                  <li>• Inscription aux événements</li>
                  <li>• Accès prioritaire</li>
                  <li>• Tarifs préférentiels</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Se connecter maintenant</Link>
                </Button>
                <Link
                  href="/"
                  className="text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </>
          )}

          {status === "used" && (
            <>
              <p className="text-center text-muted-foreground">
                Ce lien d&apos;activation a déjà été utilisé. Votre compte est
                actif.
              </p>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Se connecter</Link>
                </Button>
                <Link
                  href="/"
                  className="text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </>
          )}

          {status === "expired" && (
            <>
              <p className="text-center text-muted-foreground">
                Ce lien d&apos;activation a expiré. Veuillez contacter
                l&apos;administration pour obtenir un nouveau lien.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  📧 Contactez-nous à{" "}
                  <a
                    href="mailto:info@centreculturel.cd"
                    className="font-medium underline"
                  >
                    info@centreculturel.cd
                  </a>
                </p>
              </div>
              <Link
                href="/"
                className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Retour à l&apos;accueil
              </Link>
            </>
          )}

          {status === "invalid" && (
            <>
              <p className="text-center text-muted-foreground">
                Ce lien d&apos;activation n&apos;est pas valide. Vérifiez que
                vous avez copié l&apos;URL complète.
              </p>
              <Link
                href="/"
                className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Retour à l&apos;accueil
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
