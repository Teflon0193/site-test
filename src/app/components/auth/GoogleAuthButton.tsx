"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
  callbackURL?: string;
}



export function GoogleAuthButton({
  callbackURL,
}: GoogleAuthButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isRedirecting) {
      return;
    }

    setIsRedirecting(true);

    await signIn.social(
      {
        provider: "google",
        callbackURL: callbackURL,
      },
      {
        onSuccess: () => {
          toast.success("Connexion réussie");
        },
        onError: (error) => {
          console.error(error);
          setIsRedirecting(false);
          toast.error("Une erreur est survenue lors de la connexion avec Google");
        },
      }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer h-11 sm:h-12 border border-input bg-background hover:bg-muted/50 text-foreground font-medium transition-all shadow-sm hover:shadow-md"
      onClick={handleGoogleSignIn}
      disabled={isRedirecting}
    >
      {isRedirecting ? (
        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
      ) : (
        <Image
          src="/google.png"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5 mr-3 opacity-90"
        />
      )}
      <span>{isRedirecting ? "Redirection..." : "Continuer avec Google"}</span>
    </Button>
  );
}

export default GoogleAuthButton;
