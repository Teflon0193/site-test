"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { FaClock, FaMailBulk, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { logoutAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PendingApprovalProps {
  userName: string;
  userEmail: string;
}

export default function PendingApproval({
  userName,
  userEmail,
}: PendingApprovalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const result = await logoutAction();

      if (result.success) {
        toast.success(result.message || "Déconnexion réussie");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      } else {
        toast.error(result.error || "Erreur lors de la déconnexion");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Une erreur inattendue s'est produite");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="max-w-2xl w-full border-none shadow-lg">
        <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 px-4 sm:px-6">
          <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FaClock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight px-2">
            Compte en attente de validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          <p className="text-center text-muted-foreground text-base sm:text-lg">
            Bienvenue{" "}
            <span className="font-semibold text-foreground">{userName}</span> !
          </p>

          <div className="bg-muted/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 space-y-2.5 sm:space-y-3 border border-muted">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
              <FaMailBulk className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              Votre demande a bien été enregistrée
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Votre compte a été créé avec succès. Un administrateur du CCAPAC
              va examiner votre demande et vous recevrez un email de
              confirmation à l&apos;adresse{" "}
              <strong className="break-all">{userEmail}</strong> dès que votre
              compte sera activé.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm sm:text-base">
              <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              Prochaines étapes
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0" />
                <span>
                  Un administrateur examinera votre demande dans les plus brefs
                  délais.
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0" />
                <span>
                  Vous recevrez un email avec un lien d&apos;activation une fois
                  votre compte validé.
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0" />
                <span>
                  Cliquez sur le lien dans l&apos;email pour activer
                  définitivement votre compte.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 sm:pt-6 border-t text-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground px-2">
              En attendant, vous pouvez vous déconnecter et revenir plus tard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Retour à l&apos;accueil
              </Link>
              <span className="hidden sm:inline text-muted-foreground/30">
                |
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-xs sm:text-sm font-medium cursor-pointer text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                    <span>Déconnexion...</span>
                  </>
                ) : (
                  "Se déconnecter"
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
