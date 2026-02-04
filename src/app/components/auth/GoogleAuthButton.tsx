"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";


interface GoogleAuthButtonProps {
  callbackURL?: string;
}



export function GoogleAuthButton({
  callbackURL,
}: GoogleAuthButtonProps) {
  const handleGoogleSignIn = async () => {
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
          toast.error("Une erreur est survenue lors de la connexion avec Google");
        },
      }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer rounded-none h-11 sm:h-12 border border-input bg-white hover:bg-white/50 text-black font-medium transition-all shadow-sm hover:shadow-md"
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
