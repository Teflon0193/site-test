"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const schema = z
  .object({
    firstName: z.string().min(1, "Prénom requis"),
    lastName: z.string().min(1, "Nom requis"),
    email: z.string().min(1, "Email requis").email("Email invalide"),
    phone: z.string().min(6, "Numéro invalide").max(20, "Numéro invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mots de passe différents",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof schema>;

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<void> | void;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 text-left"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
          >
            PRÉNOM
          </Label>
          <Input
            id="firstName"
            placeholder=""
            className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
          >
            NOM
          </Label>
          <Input
            id="lastName"
            placeholder=""
            className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
        >
          ADRESSE EMAIL
        </Label>
        <Input
          id="email"
          type="email"
          placeholder=""
          autoComplete="email"
          className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
        >
          NUMÉRO DE TÉLÉPHONE
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder=""
          autoComplete="tel"
          className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
          >
            MOT DE PASSE
          </Label>
          <Input
            id="password"
            type="password"
            placeholder=""
            autoComplete="new-password"
            className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
          >
            CONFIRMATION
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder=""
            autoComplete="new-password"
            className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white h-14 font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>CRÉATION EN COURS...</span>
          </>
        ) : (
          "CRÉER MON COMPTE"
        )}
      </button>
    </form>
  );
}

export default SignupForm;
