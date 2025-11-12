"use client";

import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

const handleGoogleSignIn = async () => {
  await signIn.social(
    {
      provider: "google",
      callbackURL: "/espace-membre/admin",
    },
    {
      onSuccess: () => {
        toast.success("Connexion réussie");
      },
      onError: (error) => {
        toast.error(error.error.message);
      },
    }
  );
};

export function GoogleAuthButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer h-11 mb-4 border border-muted/30 text-base font-semibold flex items-center justify-center gap-2 bg-white hover:bg-muted/30"
      onClick={handleGoogleSignIn}
    >
      <Image src="/google.png" alt="Google" width={20} height={20} />
      <span className="text-base font-semibold">Continuer avec Google</span>
    </Button>
  );
}

export default GoogleAuthButton;
