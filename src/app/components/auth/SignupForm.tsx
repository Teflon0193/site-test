"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
  initialEmail?: string;
  onSubmit: (values: SignupFormValues) => Promise<void> | void;
}

export function SignupForm({ initialEmail = "", onSubmit }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: initialEmail,
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            placeholder="votre prénom"
            className="h-10"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive font-medium mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            placeholder="votre nom"
            className="h-10"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive font-medium mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jean.dupont@exemple.com"
          autoComplete="email"
          className="h-10"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+243 000 000 000"
          autoComplete="tel"
          className="h-10"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-destructive font-medium mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder=""
            autoComplete="new-password"
            className="h-10"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder=""
            autoComplete="new-password"
            className="h-10"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive font-medium mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer h-11 text-base font-semibold shadow-md active:scale-[0.98] transition-all mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création...
          </>
        ) : (
          "Créer mon compte"
        )}
      </Button>
    </form>
  );
}

export default SignupForm;
