import type { MakutaOperatorCode } from "@/lib/makuta";

export type Step = "identity" | "amount" | "payment";

/** Catégorie de moyen de paiement (regroupe les opérateurs Makuta). */
export type PaymentCategory = "mobile_money" | "card" | "bank_transfer";

/** Statut interne du don (aligné sur le mapping serveur TS/TF/TP). */
export type DonationStatus = "pending" | "succeeded" | "failed";

export type DonorInfo = {
  name: string;
  email: string;
  phone: string;
};

export type DonationTier = {
  id: string;
  name: string;
  description: string | null;
  minAmount: number;
  maxAmount: number | null;
};

export type CampaignStats = {
  raisedAmount: number;
  progressPercent: number;
  succeededDonationsCount: number;
  uniqueDonorsCount: number;
};

export type CampaignConfig = {
  title: string;
  description: string;
  goalAmount: number;
  currency: string;
  coverImage: string;
  coverImageAlt: string;
  tiers: DonationTier[];
  /** Optionnel : affiché uniquement si fourni (Makuta ne fournit pas de stats). */
  stats?: CampaignStats;
};

export type FundraisingErrors = Record<string, string>;

/** Réponse de création de don renvoyée par /api/makuta/donations. */
export type CreatedDonation = {
  transactionId: string;
  status: DonationStatus;
  redirectUrl: string | null;
  requiresOtp: boolean;
};

export type DonationStatusResult = {
  transactionId: string;
  status: DonationStatus;
  message: string | null;
};

export type CreateDonationInput = {
  amount: number;
  operator: MakutaOperatorCode;
  accountNumber: string;
  donor: DonorInfo;
};
