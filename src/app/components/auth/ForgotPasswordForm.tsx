"use client";

import type React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";

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
      className="space-y-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="nom@exemple.com"
            autoComplete="email"
            className="h-11 pl-10"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive font-medium">
            {errors.email.message}
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
            Envoi en cours...
          </>
        ) : (
          "Envoyer le lien de réinitialisation"
        )}
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;
