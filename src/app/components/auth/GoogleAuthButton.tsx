"use client";

interface GoogleAuthButtonProps {
  callbackURL?: string;
}

export default function GoogleAuthButton({
  callbackURL = "/espace-membre",
}: GoogleAuthButtonProps) {
  const handleGoogleLogin = () => {
    console.warn(
      "La connexion Google n'est pas activée.",
      callbackURL
    );
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
    >
      Continuer avec Google
    </button>
  );
}