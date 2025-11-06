import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Clock, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

interface PendingApprovalProps {
  userName: string;
  userEmail: string;
}

export default function PendingApproval({
  userName,
  userEmail,
}: PendingApprovalProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full rounded-2xl bg-gradient-to-br from-white to-muted/10 border border-muted/20 shadow-lg py-4">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Compte en attente de validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground text-lg">
            Bienvenue{" "}
            <span className="font-semibold text-foreground">{userName}</span> !
          </p>

          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Votre demande a bien été enregistrée
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre compte a été créé avec succès. Un administrateur du CCAPAC
              va examiner votre demande et vous recevrez un email de
              confirmation à l&apos;adresse <strong>{userEmail}</strong> dès que
              votre compte sera activé.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Prochaines étapes
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Un administrateur examinera votre demande dans les plus brefs
                  délais.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Vous recevrez un email avec un lien d&apos;activation une fois
                  votre compte validé.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Cliquez sur le lien dans l&apos;email pour activer
                  définitivement votre compte.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-muted/20 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              En attendant, vous pouvez vous déconnecter et revenir plus tard.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Retour à l&apos;accueil
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/auth/login"
                className="text-sm text-primary hover:underline"
              >
                Se déconnecter
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
