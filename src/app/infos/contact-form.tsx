"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaPaperPlane } from "react-icons/fa";
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
  firstName: z.string().trim().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères",
  }),
  lastName: z.string().trim().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
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
      form.reset();
      // You might want to use a toast notification here instead of alert in a real app
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Prénom
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-xs font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Nom
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-xs font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder=""
                    className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-xs font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Téléphone
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder=""
                    className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-xs font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Sujet
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="bg-white border-zinc-200 border-2 rounded-none h-12 px-4 text-xs font-bold uppercase tracking-wider focus:ring-0 focus:border-black transition-colors">
                    <SelectValue placeholder="SÉLECTIONNEZ UN SUJET" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-none border-2 border-black">
                  <SelectItem
                    value="information-generale"
                    className="text-[10px] font-black uppercase"
                  >
                    Information générale
                  </SelectItem>
                  <SelectItem
                    value="location-espaces"
                    className="text-[10px] font-black uppercase"
                  >
                    Location d&apos;espaces
                  </SelectItem>
                  <SelectItem
                    value="programmation"
                    className="text-[10px] font-black uppercase"
                  >
                    Programmation
                  </SelectItem>
                  <SelectItem
                    value="partenariat"
                    className="text-[10px] font-black uppercase"
                  >
                    Partenariat
                  </SelectItem>
                  <SelectItem
                    value="presse"
                    className="text-[10px] font-black uppercase"
                  >
                    Presse & Médias
                  </SelectItem>
                  <SelectItem
                    value="autre"
                    className="text-[10px] font-black uppercase"
                  >
                    Autre
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="VOTRE MESSAGE ICI..."
                  rows={6}
                  className="bg-white border-zinc-200 border-2 rounded-none p-4 text-xs font-bold uppercase tracking-wider focus-visible:ring-0 focus-visible:border-black transition-colors resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="w-full bg-black text-white h-14 font-black uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-zinc-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>ENVOI EN COURS...</span>
            </>
          ) : (
            <>
              <span>DÉMARRER LA DISCUSSION</span>
              <FaPaperPlane className="h-3 w-3" />
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
