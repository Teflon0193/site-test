"use client";

import type React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
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
    console.log("Login submit:", values);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit ?? defaultSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nom@exemple.com"
          autoComplete="email"
          className="h-11"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-primary hover:underline font-medium tab-index-[-1]"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder=""
          autoComplete="current-password"
          className="h-11"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p
            id="password-error"
            className="text-sm text-destructive font-medium"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 cursor-pointer text-base font-semibold shadow-md active:scale-[0.98] transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  );
}

export default LoginForm;
