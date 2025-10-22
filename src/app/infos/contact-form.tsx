"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { FaMailBulk } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { sendContactEmail } from "@/actions/contact";

// Schema de validation
const formSchema = z.object({
  firstName: z.string().trim().min(3, {
    message: "Le nom doit contenir au moins 3 caractères",
  }),
  lastName: z.string().trim().min(3, {
    message: "Le nom doit contenir au moins 3 caractères",
  }),
  email: z
    .string()
    .trim()
    .email({ message: "Veuillez entrer un email valide" }),
  phone: z.string().trim().min(10, {
    message: "Le numéro de téléphone doit contenir au moins 10 caractères",
  }),
  subject: z.string().min(1, { message: "Veuillez choisir un sujet" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" }),
});

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await sendContactEmail(values);
      console.log("Formulaire soumis:", values);

      // Reset du formulaire après succès
      form.reset();
      alert("Message envoyé avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-semibold text-foreground">
                  Prénom *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre prénom"
                    className="text-foreground bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-10 sm:h-11 lg:h-12 transition-all duration-300"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm font-medium" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-semibold text-foreground">
                  Nom *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre nom"
                    className="text-foreground bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-10 sm:h-11 lg:h-12 transition-all duration-300"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-semibold text-foreground">
                  Email *
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="text-foreground bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-10 sm:h-11 lg:h-12 transition-all duration-300"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-semibold text-foreground">
                  Numéro de téléphone *
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Votre numéro de téléphone"
                    className="text-foreground bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-10 sm:h-11 lg:h-12 transition-all duration-300"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel className="text-sm sm:text-base font-semibold text-foreground">
                  Sujet *
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl h-11 sm:h-12 transition-all duration-300">
                      <SelectValue placeholder="Choisissez un sujet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-muted/30">
                    <SelectItem value="information-generale">
                      Information générale
                    </SelectItem>
                    <SelectItem value="location-espaces">
                      Location d&apos;espaces
                    </SelectItem>
                    <SelectItem value="programmation">Programmation</SelectItem>
                    <SelectItem value="demande-de-devis">
                      Partenariat
                    </SelectItem>
                    <SelectItem value="accessibilite">Accessibilité</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm font-medium" />
              </FormItem>
            )}
          />
        </div>

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base font-semibold text-foreground">
                Message *
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre demande en détail..."
                  rows={6}
                  className="resize-none text-foreground bg-gradient-to-r from-muted/30 to-muted/10 border-muted/30 focus:border-primary focus:ring-primary/20 rounded-xl transition-all duration-300"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm font-medium" />
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        <Button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-black font-bold h-10 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-lg"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <FaMailBulk className="h-5 w-5 mr-2" />
              Envoyer le message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
