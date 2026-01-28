import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-xl py-4">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Vérifiez votre adresse email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Nous avons envoyé un email de vérification à votre adresse.
            </p>
            <p className="text-sm text-muted-foreground">
              Veuillez cliquer sur le lien dans l&apos;email pour activer votre
              compte et accéder à votre espace membre.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">Vous n&apos;avez pas reçu l&apos;email ?</p>
            <ul className="text-xs text-muted-foreground space-y-1 text-left">
              <li>• Vérifiez votre dossier spam ou courrier indésirable</li>
              <li>• Assurez-vous d&apos;avoir saisi la bonne adresse email</li>
              <li>• Le lien de vérification est valable pendant 24 heures</li>
            </ul>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
