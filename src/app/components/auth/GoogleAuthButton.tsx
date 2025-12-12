"use client";

import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

interface GoogleAuthButtonProps {
  callbackURL?: string;
  onSuccess?: () => void;
  onError?: (error: { error: { message: string } }) => void;
}

export function GoogleAuthButton({
  callbackURL,
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  const handleGoogleSignIn = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL,
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            toast.success("Connexion réussie");
          }
        },
        onError: (error) => {
          if (onError) {
            onError(error);
          } else {
            toast.error(error.error.message);
          }
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
    >
      <Image
        src="/google.png"
        alt="Google"
        width={20}
        height={20}
        className="w-5 h-5 mr-3 opacity-90"
      />
      <span>Continuer avec Google</span>
    </Button>
  );
}

export default GoogleAuthButton;
