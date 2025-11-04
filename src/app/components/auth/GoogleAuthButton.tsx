"use client";

import type React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  onClick: () => void;
  label?: string;
}

export function GoogleAuthButton({
  onClick,
  label = "Continuer avec Google",
}: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer h-11 mb-4 border border-muted/30 text-base font-semibold flex items-center justify-center gap-2 bg-white hover:bg-muted/30"
      onClick={onClick}
    >
      <Image src="/google.png" alt="Google" width={20} height={20} />
      <span className="text-base font-semibold">{label}</span>
    </Button>
  );
}

export default GoogleAuthButton;
