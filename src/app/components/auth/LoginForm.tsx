"use client";

import type React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginFormValues = z.infer<typeof schema>;

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const defaultSubmit = useCallback((values: LoginFormValues) => {
    // À connecter au flux d'auth (BetterAuth) ultérieurement

    console.log("Login submit:", values);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit ?? defaultSubmit)}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre.email@exemple.com"
          className="h-11"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-red-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder=""
          className="h-11"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="password-error" className="text-sm text-red-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full h-11 cursor-pointer text-base font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}

export default LoginForm;
