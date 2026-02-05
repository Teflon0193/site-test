"use client";

import type React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
      className="space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
        >
          EMAIL
        </Label>
        <Input
          id="email"
          type="email"
          placeholder=""
          autoComplete="email"
          className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-[10px] uppercase font-bold text-red-500"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
          >
            MOT DE PASSE
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-[10px] text-zinc-400 hover:text-black font-black uppercase tracking-widest transition-colors"
          >
            OUBLIÉ ?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder=""
          autoComplete="current-password"
          className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p
            id="password-error"
            className="text-[10px] uppercase font-bold text-red-500"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white h-14 font-black uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-800"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>ACCÈS EN COURS...</span>
          </>
        ) : (
          "SE CONNECTER"
        )}
      </button>
    </form>
  );
}

export default LoginForm;
