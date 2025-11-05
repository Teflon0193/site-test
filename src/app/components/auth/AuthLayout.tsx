"use client";

import type React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-0 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image
              src="/images/logo-primary.png"
              alt="Logo CCAPAC"
              width={160}
              height={120}
              className="mx-auto mb-4"
              priority
            />
          </div>

          {children}
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-transparent to-secondary/50" />
        <Image
          src="/images/grand-tambour-fond.jpg"
          alt="Grand Tambour CCAPAC"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
          <div className="space-y-4 text-white drop-shadow-lg">
            <h2 className="text-4xl uppercase font-bold text-balance">
              Centre Culturel et Artistique des Pays d&apos;Afrique Centrale
            </h2>
            <p className="text-xl font-bold text-white/90">Grand Tambour</p>
            <p className="text-lg text-white/80">
              Rejoignez notre communauté culturelle
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


