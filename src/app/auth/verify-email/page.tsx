"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { verifyEmail, resendVerification } from "@/services/auth";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Aucun token de vérification fourni.");
      return;
    }

    verifyEmail(token)
      .then((response) => {
        if (response.success) {
          setStatus("success");
          setMessage("Votre email a été vérifié avec succès !");
          toast.success("Email vérifié !");
          setTimeout(() => router.push("/auth/login"), 3000);
        } else {
          setStatus("error");
          setMessage(response.message || "Token invalide ou expiré.");
        }
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error?.response?.data?.message || "Erreur lors de la vérification.");
      });
  }, [token, router]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    try {
      const response = await resendVerification(email);
      if (response.success) {
        toast.success("Un nouveau lien de vérification a été envoyé !");
      } else {
        toast.error(response.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  if (status === "loading") {
    return (
      <div className="text-center space-y-4 py-8">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground">Vérification de votre email en cours...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4 py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Email vérifié !</h1>
        <p className="text-muted-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">
          Vous serez redirigé vers la page de connexion dans quelques secondes...
        </p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 text-primary hover:underline"
        >
          Se connecter maintenant
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 py-8">
      <XCircle className="w-16 h-16 text-red-500 mx-auto" />
      <h1 className="text-2xl font-bold text-foreground">Vérification échouée</h1>
      <p className="text-muted-foreground">{message}</p>

      <div className="bg-muted/50 border border-muted rounded-lg p-4 mt-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Vous pouvez demander un nouveau lien de vérification :
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Votre email"
            className="flex-1 px-3 py-2 border rounded-md bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleResend}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Renvoyer
          </button>
        </div>
      </div>

      <div className="text-center text-sm">
        <Link
          href="/auth/login"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Vérification de l'email">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}