"use client";

import type React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
});

export type ForgotPasswordFormValues = z.infer<typeof schema>;

interface ForgotPasswordFormProps {
  onSubmit?: (values: ForgotPasswordFormValues) => Promise<void> | void;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const defaultSubmit = useCallback((values: ForgotPasswordFormValues) => {
    console.log("Forgot password submit:", values);
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
          ADRESSE EMAIL
        </Label>
        <div className="relative">
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
        </div>
        {errors.email && (
          <p
            id="email-error"
            className="text-[10px] uppercase font-bold text-red-500 mt-1"
          >
            {errors.email.message}
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
            <span>ENVOI EN COURS...</span>
          </>
        ) : (
          "RÉINITIALISER MON ACCÈS"
        )}
      </button>
    </form>
  );
}

export default ForgotPasswordForm;
