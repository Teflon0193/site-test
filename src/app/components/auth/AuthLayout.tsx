"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Column: Form */}
      <div className="relative flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 py-16 bg-white overflow-y-auto">
        <div className="w-full max-w-[400px] mx-auto lg:max-w-[440px]">
          <div className="mb-16 text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <Image
                src="/images/logo-primary.png"
                alt="Logo CCAPAC"
                width={120}
                height={80}
                className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                priority
              />
            </Link>
          </div>

          <div className="animate-slide-up">{children}</div>

          <div className="mt-16 pt-8 border-t border-zinc-100 lg:hidden text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
              © {new Date().getFullYear()} CCAPAC — KINSHASA, RDC
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Component */}
      <div className="hidden lg:flex flex-col relative bg-black text-white overflow-hidden border-l-2 border-black">
        <div className="absolute inset-0 z-10 opacity-40 bg-black" />
        <Image
          src="/images/grand-tambour-fond.jpg"
          alt="Grand Tambour CCAPAC"
          fill
          className="object-cover grayscale"
          priority
          quality={100}
        />

        <div className="relative z-20 flex flex-col items-start justify-center h-full px-20">
          <div className="space-y-8 max-w-xl">
            <span className="inline-block px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em]">
              PATRIMOINE CULTUREL
            </span>
            <h2 className="text-5xl xl:text-6xl font-black tracking-tighter text-white uppercase leading-none">
              VIVEZ LA <br />
              <span className="text-white tracking-[-0.05em]">
                CULTURE AFRICAINE
              </span>
            </h2>
            <div className="w-20 h-2 bg-white"></div>
            <p className="text-xl text-zinc-300 leading-tight font-black uppercase tracking-tight max-w-md">
              Promouvoir, valoriser et transmettre le patrimoine culturel au
              cœur de l&apos;Afrique Centrale.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 z-20">
          <div className="w-12 h-12 border-t-4 border-r-4 border-white/20"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-12 z-20">
          <div className="w-12 h-12 border-b-4 border-l-4 border-white/20"></div>
        </div>

        <div className="absolute bottom-12 w-full px-20 z-20 text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
            © {new Date().getFullYear()} CCAPAC — TOUS DROITS RÉSERVÉS
          </p>
        </div>
      </div>
    </div>
  );
}
