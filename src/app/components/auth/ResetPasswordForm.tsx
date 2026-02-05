"use client";

import type React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  onSubmit?: (values: ResetPasswordFormValues) => Promise<void> | void;
}

export function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const defaultSubmit = useCallback((values: ResetPasswordFormValues) => {
    console.log("Reset password submit:", values);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit ?? defaultSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <Label
          htmlFor="newPassword"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
        >
          NOUVEAU MOT DE PASSE
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder=""
            autoComplete="new-password"
            className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors pr-12"
            aria-invalid={!!errors.newPassword}
            aria-describedby={
              errors.newPassword ? "newPassword-error" : undefined
            }
            {...register("newPassword")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p
            id="newPassword-error"
            className="text-[10px] uppercase font-bold text-red-500 mt-1"
          >
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
        >
          CONFIRMER LE MOT DE PASSE
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder=""
            autoComplete="new-password"
            className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-sm font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors pr-12"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword ? "confirmPassword-error" : undefined
            }
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="text-[10px] uppercase font-bold text-red-500 mt-1"
          >
            {errors.confirmPassword.message}
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
            <span>RÉINITIALISATION...</span>
          </>
        ) : (
          "RÉINITIALISER LE MOT DE PASSE"
        )}
      </button>
    </form>
  );
}

export default ResetPasswordForm;
