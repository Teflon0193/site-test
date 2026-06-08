"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  CreditCard,
  HandCoins,
  Landmark,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  // WalletCards,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { StripeEmbeddedCheckout } from "./StripeEmbeddedCheckoutDialog";

const StripeEmbeddedCheckoutDialog = dynamic(
  () =>
    import("./StripeEmbeddedCheckoutDialog").then(
      (module) => module.StripeEmbeddedCheckoutDialog
    ),
  { ssr: false }
);

type Step = "amount" | "identity" | "payment";
type PaymentMethod = "card" | "paypal" | "mobile_money";

type DonationStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

type CreatedDonation = {
  donation_id: string;
  status: DonationStatus;
  provider_instructions: string | null;
  pawapay: {
    country?: string;
    provider?: string;
    provider_amount?: number;
    provider_currency?: string;
    last_provider_status?: string;
  } | null;
};

type CampaignResponse = {
  campaign: {
    id: string;
    title: string;
    description: string | null;
    goal_amount: number;
    currency: string;
    status: "draft" | "active" | "paused" | "completed" | "archived";
    cover_image_url: string | null;
  };
  tiers: Array<{
    id: string;
    name: string;
    description: string | null;
    min_amount: number;
    max_amount: number | null;
    display_order: number;
  }>;
  stats: {
    raised_amount: number;
    progress_percent: number;
    succeeded_donations_count: number;
    unique_donors_count: number;
    pending_donations_count: number;
  };
};

const impactItems = [
  "561 m2 entièrement aménagés pour la lecture et la médiation.",
  "5 000 ouvrages initiaux, dont 3 000 pour la Bibliothèque.",
  "Outils numériques de recherche et de formation.",
  "Ateliers, clubs de lecture et rencontres littéraires.",
];

const paymentMethods = [
  {
    id: "mobile_money" as const,
    title: "Mobile Money",
    detail: "Paiement par mobile money",
    icon: Phone,
  },
  {
    id: "card" as const,
    title: "Carte bancaire",
    detail: "Paiement sécurisé par carte",
    icon: CreditCard,
  },
  // {
  //   id: "paypal" as const,
  //   title: "PayPal",
  //   detail: "Paiement avec votre compte",
  //   icon: WalletCards,
  // },
];

const bankAccounts = [
  {
    bank: "Rawbank",
    number: "CD48 05100051010120306000152",
  },
  {
    bank: "Equity BCDC",
    number: "00011150511200194697606 USD",
  },
  {
    bank: "Ecobank",
    number: "0026000013508010061362 USD",
  },
];

const formatMoney = (value: number, currency = "USD") =>
  `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)} ${currency}`;

const formatTierRange = (
  minAmount: number,
  maxAmount: number | null,
  currency: string
) => {
  if (maxAmount === null) {
    return `${formatMoney(minAmount, currency)} +`;
  }

  return `${formatMoney(minAmount, currency)} - ${formatMoney(
    maxAmount,
    currency
  )}`;
};

const formatDonationStatus = (status: DonationStatus) => {
  const labels: Record<DonationStatus, string> = {
    pending: "en attente",
    succeeded: "confirmé",
    failed: "non abouti",
    cancelled: "annulé",
    refunded: "remboursé",
  };

  return labels[status];
};

export default function FundraisingSection() {
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(
    null
  );
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [campaignError, setCampaignError] = useState("");
  const [step, setStep] = useState<Step>("amount");
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isVerifyingDonation, setIsVerifyingDonation] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [mobileDonation, setMobileDonation] = useState<CreatedDonation | null>(
    null
  );
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [stripeCheckout, setStripeCheckout] =
    useState<StripeEmbeddedCheckout | null>(null);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const amountActionRef = useRef<HTMLDivElement | null>(null);
  const fullNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadCampaign() {
      try {
        const response = await fetch("/api/fundraising/campaign", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message ||
              "La collecte ne peut pas être affichée pour le moment."
          );
        }

        if (ignore) return;

        setCampaignData(data);
        setSelectedTierId(data.tiers.at(-1)?.id || null);
      } catch (error) {
        if (!ignore) {
          setCampaignError(
            error instanceof Error
              ? error.message
              : "La collecte ne peut pas être affichée pour le moment."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingCampaign(false);
        }
      }
    }

    loadCampaign();

    return () => {
      ignore = true;
    };
  }, []);

  const tiers = campaignData?.tiers || [];
  const currency = campaignData?.campaign.currency || "USD";
  const selectedTier = tiers.find((tier) => tier.id === selectedTierId);
  const minimumAmount = Math.max(
    tiers.length ? Math.min(...tiers.map((tier) => tier.min_amount)) : 0,
  );
  const campaignIsActive = campaignData?.campaign.status === "active";

  const selectedAmount = useMemo(() => {
    if (useCustomAmount) {
      return Number(customAmount) || 0;
    }

    return selectedTier?.min_amount || minimumAmount;
  }, [customAmount, minimumAmount, selectedTier?.min_amount, useCustomAmount]);

  const selectedLabel = useCustomAmount
    ? "Montant libre"
    : selectedTier?.name || "Contribution";

  const progressPercent = Math.min(
    Math.max(campaignData?.stats.progress_percent || 0, 0),
    100
  );

  const updateError = (field: string) => {
    if (!errors[field]) return;

    const nextErrors = { ...errors };
    delete nextErrors[field];
    setErrors(nextErrors);
  };

  const clearStepFeedback = () => {
    setErrors({});
    setCheckoutError("");
  };

  const scrollToAmountAction = () => {
    window.requestAnimationFrame(() => {
      amountActionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const goBackToAmount = () => {
    clearStepFeedback();
    setStep("amount");
  };

  const goBackToIdentity = () => {
    clearStepFeedback();
    setStep("identity");
  };

  const goToIdentity = () => {
    setCheckoutError("");

    if (!campaignIsActive) {
      setErrors({
        amount: "Les contributions en ligne ne sont pas ouvertes pour le moment.",
      });
      return;
    }

    if (selectedAmount < minimumAmount) {
      setErrors({
        amount: `Le montant minimum est de ${formatMoney(
          minimumAmount,
          currency
        )}.`,
      });
      return;
    }

    setErrors({});
    setStep("identity");
  };

  useEffect(() => {
    if (step !== "identity") return;

    window.requestAnimationFrame(() => {
      fullNameInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      fullNameInputRef.current?.focus({ preventScroll: true });
    });
  }, [step]);

  const goToPayment = () => {
    const nextErrors: Record<string, string> = {};
    setCheckoutError("");

    if (!fullName.trim()) {
      nextErrors.fullName = "Le nom du donateur ou de l'organisation est requis.";
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = "Veuillez renseigner une adresse e-mail valide.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStep("payment");
  };

  const createCheckout = async () => {
    setCheckoutError("");

    if (paymentMethod === "mobile_money" && !mobileMoneyPhone.trim()) {
      setCheckoutError(
        "Indiquez le numéro Mobile Money qui recevra la demande de paiement."
      );
      return;
    }

    setIsCreatingCheckout(true);

    try {
      const response = await fetch("/api/fundraising/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedAmount,
          payment_method: paymentMethod,
          client_request_id: crypto.randomUUID(),
          donor: {
            name: fullName,
            email,
            phone:
              paymentMethod === "mobile_money"
                ? mobileMoneyPhone
                : phone || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            "Le paiement ne peut pas être démarré pour le moment."
        );
      }

      if (paymentMethod === "mobile_money") {
        setMobileDonation({
          donation_id: data.donation_id,
          status: data.status,
          provider_instructions: data.provider_instructions,
          pawapay: data.pawapay,
        });
        setIsMobileModalOpen(true);
        setIsCreatingCheckout(false);
        return;
      }

      sessionStorage.setItem("ccapac.last_donation_id", data.donation_id);

      if (paymentMethod === "card") {
        setStripeCheckout({
          donationId: data.donation_id,
          publishableKey: data.stripe.publishable_key,
          clientSecret: data.stripe.client_secret,
        });
        setIsStripeModalOpen(true);
        setIsCreatingCheckout(false);
        return;
      }

      window.location.assign(data.checkout_url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Le paiement ne peut pas être démarré pour le moment."
      );
      setIsCreatingCheckout(false);
    }
  };

  const fetchDonationStatus = useCallback(async (donationId: string) => {
    const response = await fetch(
      `/api/fundraising/donations/${donationId}/verify`,
      { method: "POST" }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
          "Nous ne pouvons pas confirmer le paiement pour le moment."
      );
    }

    return data as {
      status: DonationStatus;
      provider_instructions: string | null;
      pawapay: CreatedDonation["pawapay"];
    };
  }, []);

  const withDonationVerification = useCallback(async (
    action: () => Promise<void>
  ) => {
    setIsVerifyingDonation(true);
    setCheckoutError("");

    try {
      await action();
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Nous ne pouvons pas confirmer le paiement pour le moment."
      );
    } finally {
      setIsVerifyingDonation(false);
    }
  }, []);

  const verifyMobileDonation = useCallback((donationId: string) =>
    withDonationVerification(async () => {
      const data = await fetchDonationStatus(donationId);

      setMobileDonation((current) =>
        current
          ? {
              ...current,
              status: data.status,
              provider_instructions:
                data.provider_instructions || current.provider_instructions,
              pawapay: data.pawapay || current.pawapay,
            }
          : current
      );
    }), [fetchDonationStatus, withDonationVerification]);

  useEffect(() => {
    if (!mobileDonation || mobileDonation.status !== "pending") return;

    const interval = window.setInterval(() => {
      verifyMobileDonation(mobileDonation.donation_id);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [mobileDonation, verifyMobileDonation]);

  useEffect(() => {
    if (mobileDonation?.status !== "succeeded") return;

    const timeout = window.setTimeout(() => {
      window.location.assign(
        `/don-merci?donation_id=${encodeURIComponent(
          mobileDonation.donation_id
        )}`
      );
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [mobileDonation]);

  if (isLoadingCampaign) {
    return (
      <FundraisingShell>
        <FundraisingSkeleton />
      </FundraisingShell>
    );
  }

  if (campaignError || !campaignData) {
    return (
      <FundraisingShell>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
            Campagne indisponible
          </p>
          <h2 className="mt-3 text-2xl font-bold uppercase text-primary sm:text-3xl">
            La collecte n&apos;est pas disponible
          </h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-primary/75">
            {campaignError ||
              "Merci de réessayer plus tard ou de contacter l'équipe CCAPAC."}
          </p>
        </div>
      </FundraisingShell>
    );
  }

  return (
    <section
      id="fundraising"
      className="relative overflow-hidden bg-[#f4efe4] py-16 text-primary sm:py-20 lg:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-36 bg-primary" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <aside className="overflow-hidden rounded-lg bg-primary text-white shadow-2xl">
            <div className="relative min-h-[410px]">
              <Image
                src="/images/espace4.jpg"
                alt="Espace de lecture du Grand Tambour"
                fill
                className="object-cover opacity-72"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25150e] via-[#25150e]/68 to-[#25150e]/8" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-md">
                  <HandCoins className="h-4 w-4 text-[#ffcc02]" />
                  Collecte en cours
                </div>

                <h2 className="max-w-xl text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-4xl">
                  {campaignData.campaign.title}
                </h2>

                {campaignData.campaign.description && (
                  <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-white/82 sm:text-base">
                    {campaignData.campaign.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 border-t border-white/12 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Objectif"
                  value={formatMoney(campaignData.campaign.goal_amount, currency)}
                />
                <StatCard
                  label="Collecte"
                  value={formatMoney(campaignData.stats.raised_amount, currency)}
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/62">
                  <span>Progression de la collecte</span>
                  <span>{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/14">
                  <div
                    className="h-full rounded-full bg-[#ffcc02]"
                    style={{ width: `${Math.max(progressPercent, 2)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-medium text-white/62">
                  {campaignData.stats.succeeded_donations_count} dons confirmés
                  par {campaignData.stats.unique_donors_count} donateurs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                  <BookOpen className="h-4 w-4 text-[#ffcc02]" />
                  Ce que le don finance
                </div>
                <ul className="space-y-2.5">
                  {impactItems.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-white/78"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#ffcc02]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="rounded-lg border border-[#d5b58d]/45 bg-white shadow-xl">
            <div className="border-b border-[#eadcc7] px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                    Faire un don
                  </p>
                  <h3 className="mt-2 text-2xl font-bold uppercase leading-tight text-primary sm:text-3xl">
                    Choisissez votre contribution
                  </h3>
                </div>

                <ol className="grid w-full grid-cols-3 gap-1 rounded-md border border-secondary/10 bg-secondary/5 p-1 text-[10px] font-bold uppercase tracking-wide sm:w-[360px]">
                  {[
                    ["amount", "Montant"],
                    ["identity", "Profil"],
                    ["payment", "Paiement"],
                  ].map(([id, label], index) => {
                    const active = step === id;
                    const done =
                      (step === "identity" && index === 0) ||
                      (step === "payment" && index < 2);

                    return (
                      <li
                        key={id}
                        className={`min-w-0 rounded px-2 py-2.5 text-center transition ${
                          active || done
                            ? "bg-primary text-white shadow-sm"
                            : "text-secondary/75"
                        }`}
                      >
                        {label}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {!campaignIsActive && (
                <div className="mb-5 rounded-md border border-secondary/20 bg-secondary/5 p-4 text-sm font-semibold text-primary">
                  Les contributions en ligne ne sont pas ouvertes pour le moment.
                </div>
              )}

              {step === "amount" && (
                <div className="space-y-6">
                  <div className="grid gap-3">
                    {tiers.map((tier) => {
                      const isSelected =
                        selectedTierId === tier.id && !useCustomAmount;

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedTierId(tier.id);
                            setUseCustomAmount(false);
                            setCustomAmount("");
                            clearStepFeedback();
                            scrollToAmountAction();
                          }}
                          className={`group grid gap-3 rounded-md border p-4 text-left transition duration-200 sm:grid-cols-[1fr_auto] sm:items-center ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-lg"
                              : "border-[#eadcc7] bg-[#fdfbf6] text-primary hover:border-secondary hover:bg-white"
                          }`}
                        >
                          <span>
                            <span className={`block text-sm font-bold ${isSelected ? "text-white" : "text-black"} uppercase tracking-wide`}>
                              {tier.name}
                            </span>
                            {tier.description && (
                              <span
                                className={`mt-1 block text-xs font-medium ${
                                  isSelected ? "text-white/72" : "text-black/65"
                                }`}
                              >
                                {tier.description}
                              </span>
                            )}
                          </span>
                          <span
                            className={`rounded-md px-3 py-2 text-sm font-bold ${
                              isSelected
                                ? "bg-[#ffcc02] text-[#3a2014]"
                                : "bg-white text-primary shadow-sm"
                            }`}
                          >
                            {formatTierRange(
                              tier.min_amount,
                              tier.max_amount,
                              currency
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-md border border-dashed border-secondary/55 bg-[#f8f1e7] p-4">
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomAmount(true);
                        clearStepFeedback();
                        scrollToAmountAction();
                      }}
                      className="mb-3 flex w-full items-center justify-between gap-3 text-left"
                    >
                      <span>
                        <span className="block text-sm font-bold uppercase tracking-wide">
                          Montant libre
                        </span>
                        <span className="text-xs font-medium text-primary/65">
                          A partir de {formatMoney(minimumAmount, currency)}.
                        </span>
                      </span>
                      <span
                        className={`h-4 w-4 rounded-full border ${
                          useCustomAmount
                            ? "border-primary bg-primary"
                            : "border-primary/35 bg-white"
                        }`}
                      />
                    </button>

                    <label className="relative block">
                      <span className="absolute inset-y-0 left-4 flex items-center text-xs font-bold text-primary/55">
                        {currency}
                      </span>
                      <input
                        type="number"
                        min={minimumAmount}
                        value={customAmount}
                        onFocus={() => setUseCustomAmount(true)}
                        onChange={(event) => {
                          setCustomAmount(event.target.value);
                          updateError("amount");
                          setCheckoutError("");
                        }}
                        placeholder="Saisir un montant"
                        className="h-12 w-full rounded-md border border-[#eadcc7] bg-white pl-16 pr-4 text-sm font-bold text-primary outline-none transition focus:border-primary"
                      />
                    </label>
                    {errors.amount && (
                      <p className="mt-2 text-xs font-semibold text-red-700">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div ref={amountActionRef}>
                    <SummaryBar
                      label={selectedLabel}
                      amount={selectedAmount}
                      currency={currency}
                      actionLabel="Continuer"
                      disabled={!campaignIsActive}
                      onAction={goToIdentity}
                    />
                  </div>
                </div>
              )}

              {step === "identity" && (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <Field
                      label="Nom complet ou organisation"
                      inputRef={fullNameInputRef}
                      value={fullName}
                      onChange={(value) => {
                        setFullName(value);
                        updateError("fullName");
                        setCheckoutError("");
                      }}
                      placeholder="Ex. Fondation CCAPAC"
                      error={errors.fullName}
                    />
                    <Field
                      label="Adresse e-mail"
                      type="email"
                      value={email}
                      onChange={(value) => {
                        setEmail(value);
                        updateError("email");
                        setCheckoutError("");
                      }}
                      placeholder="contact@organisation.org"
                      error={errors.email}
                    />
                    <Field
                      label="Téléphone"
                      type="tel"
                      value={phone}
                      onChange={(value) => {
                        setPhone(value);
                        setCheckoutError("");
                      }}
                      placeholder="+243 812 345 678"
                      optional
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SecondaryButton onClick={goBackToAmount}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </SecondaryButton>
                    <PrimaryButton onClick={goToPayment}>
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(method.id);
                            setCheckoutError("");
                          }}
                          className={`rounded-md border p-4 text-left transition ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-lg"
                              : "border-[#eadcc7] bg-[#fdfbf6] text-black hover:border-secondary"
                          }`}
                        >
                          <Icon
                            className={`mb-3 h-5 w-5 ${
                              isSelected ? "text-[#ffcc02]" : "text-secondary"
                            }`}
                          />
                          <span className="block text-sm font-bold uppercase">
                            {method.title}
                          </span>
                          <span
                            className={`mt-1 block text-xs leading-relaxed ${
                              isSelected ? "text-white/72" : "text-secondary/65"
                            }`}
                          >
                            {method.detail}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === "mobile_money" && (
                    <div className="rounded-md border border-secondary/25 bg-[#f8f1e7] p-4">
                      <div className="mb-4 flex items-start gap-3">
                        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-secondary/12 text-secondary">
                          <Phone className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wide text-primary">
                            Numéro de paiement Mobile Money
                          </p>
                          <p className="mt-1 text-sm font-medium leading-relaxed text-black/65">
                            Saisissez le numéro qui recevra la demande de
                            paiement. Il peut être différent du numéro de
                            contact renseigné à l&apos;étape précédente.
                          </p>
                        </div>
                      </div>
                      <Field
                        label="Numéro Mobile Money"
                        type="tel"
                        value={mobileMoneyPhone}
                        onChange={(value) => {
                          setMobileMoneyPhone(value);
                          setCheckoutError("");
                        }}
                        placeholder="+243 812 345 678"
                        error={
                          checkoutError && !mobileMoneyPhone.trim()
                            ? checkoutError
                            : undefined
                        }
                      />
                      <p className="mt-3 text-xs font-semibold text-black/58">
                        Utilisez le format international, par exemple +243 pour la RDC.
                      </p>
                    </div>
                  )}

                  <div className="rounded-md border border-[#eadcc7] bg-white p-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <ReceiptLine label="Niveau" value={selectedLabel} />
                      <ReceiptLine
                        label="Montant"
                        value={formatMoney(selectedAmount, currency)}
                      />
                      <ReceiptLine label="Donateur" value={fullName || "-"} />
                    </div>
                  </div>

                  {checkoutError &&
                    !(
                      paymentMethod === "mobile_money" &&
                      !mobileMoneyPhone.trim()
                    ) && (
                    <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                      {checkoutError}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SecondaryButton
                      disabled={isCreatingCheckout}
                      onClick={goBackToIdentity}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </SecondaryButton>
                    <PrimaryButton
                      disabled={isCreatingCheckout}
                      onClick={createCheckout}
                    >
                      {isCreatingCheckout
                        ? "Preparation du paiement..."
                        : paymentMethod === "mobile_money"
                        ? "Finaliser le paiement"
                        : "Continuer au paiement"}
                      <ShieldCheck className="h-4 w-4" />
                    </PrimaryButton>
                  </div>

                  <BankTransferInfo />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#eadcc7] bg-[#fdfbf6] px-5 py-4 text-xs font-semibold text-primary/65 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Paiement sécurisé
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                info@centreculturel.cd
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                +243 890 809 745
              </span>
 
              
            </div>
          </div>
        </div>
      </div>

      <MobileMoneyStatusDialog
        donation={mobileDonation}
        open={isMobileModalOpen}
        isVerifying={isVerifyingDonation}
        onOpenChange={(open) => {
          if (!open && mobileDonation?.status === "pending") {
            setMobileDonation(null);
          }
          setIsMobileModalOpen(open);
        }}
        onCancel={() => {
          setMobileDonation(null);
          setIsMobileModalOpen(false);
        }}
        onVerify={() => {
          if (mobileDonation) {
            verifyMobileDonation(mobileDonation.donation_id);
          }
        }}
      />

      <StripeEmbeddedCheckoutDialog
        checkout={stripeCheckout}
        open={isStripeModalOpen}
        onOpenChange={setIsStripeModalOpen}
      />

    </section>
  );
}

function MobileMoneyStatusDialog({
  donation,
  open,
  isVerifying,
  onOpenChange,
  onCancel,
  onVerify,
}: {
  donation: CreatedDonation | null;
  open: boolean;
  isVerifying: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onVerify: () => void;
}) {
  const isPending = donation?.status === "pending";
  const isConfirmed = donation?.status === "succeeded";
  const hasFailed =
    donation?.status === "failed" ||
    donation?.status === "cancelled" ||
    donation?.status === "refunded";
  const amount =
    donation?.pawapay?.provider_amount && donation.pawapay.provider_currency
      ? formatMoney(
          donation.pawapay.provider_amount,
          donation.pawapay.provider_currency
        )
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[calc(100svh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-[560px] overflow-hidden p-0"
      >
        <div className="bg-primary px-5 py-5 text-white sm:px-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold uppercase leading-tight sm:text-xl">
              {isConfirmed ? "Paiement confirmé" : "Validez sur votre téléphone"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-white/72">
              {isConfirmed
                ? "Merci pour votre soutien. Nous finalisons la confirmation."
                : "Une demande de paiement a été envoyée sur votre téléphone."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(100svh-7rem)] space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-6">
          <div className="rounded-md border border-secondary/20 bg-[#f8f1e7] p-4">
            <p className="text-sm font-semibold leading-relaxed text-primary">
              {isConfirmed
                ? "Votre validation a été reçue. Vous allez être redirigé vers la page de confirmation."
                : "Entrez votre code secret sur votre téléphone pour valider la transaction. La confirmation s'affichera automatiquement ici."}
            </p>
            {amount && !isConfirmed && (
              <p className="mt-3 text-sm font-bold text-primary">
                Montant à valider: {amount}
              </p>
            )}
          </div>

          <StatusPanel
            status={donation?.status || "pending"}
            detail={
              isPending
                ? "En attente de votre validation."
                : hasFailed
                ? "Le paiement n'a pas abouti."
                : "Votre don est confirmé."
            }
          />

          {isPending && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-relaxed text-red-800">
              Ne fermez pas cette page avant la confirmation. Validez la
              transaction depuis votre téléphone avec votre code secret.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={isVerifying || !donation || !isPending}
              onClick={onVerify}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isVerifying ? "Confirmation..." : "Actualiser"}
            </button>
            {isPending ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-md border border-secondary/35 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-primary transition hover:bg-[#f8f1e7]"
              >
                Annuler
              </button>
            ) : (
              <button
                type="button"
                disabled={isConfirmed}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center rounded-md border border-secondary/35 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wide text-primary transition hover:bg-[#f8f1e7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConfirmed ? "Redirection..." : "Fermer"}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BankTransferInfo() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyAccountNumber = async (accountNumber: string) => {
    await navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(accountNumber);

    window.setTimeout(() => {
      setCopiedAccount((current) =>
        current === accountNumber ? null : current
      );
    }, 2000);
  };

  return (
    <div className="border-t border-[#eadcc7] pt-5">
      <details className="group rounded-md border border-[#eadcc7] bg-[#fdfbf6]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-left marker:hidden">
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-secondary/10 text-secondary">
              <Landmark className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-primary">
                Vous préférez effectuer un virement bancaire ?
              </span>
              <span className="mt-1 block text-xs font-medium leading-relaxed text-primary/60">
                Consultez les coordonnées bancaires
              </span>
            </span>
          </span>
          <ChevronDown className="h-4 w-4 flex-none text-secondary transition-transform group-open:rotate-180" />
        </summary>

        <div className="border-t border-[#eadcc7] px-4 py-4">
          <p className="mb-4 text-sm font-medium leading-relaxed text-primary/72">
            Le virement bancaire est une alternative aux paiements en ligne.
            Choisissez un compte ci-dessous, puis contactez-nous après votre
            transfert pour nous permettre de l&apos;identifier.
          </p>

          <div className="grid gap-2">
            {bankAccounts.map((account) => {
              const isCopied = copiedAccount === account.number;

              return (
                <div
                  key={account.number}
                  className="flex flex-col gap-3 rounded-md border border-[#eadcc7]/80 bg-white px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <span className="block font-bold text-primary">
                      {account.bank}
                    </span>
                    <span className="mt-1 block break-all font-semibold text-primary/70">
                      {account.number}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyAccountNumber(account.number)}
                    className="inline-flex flex-none items-center justify-center gap-2 rounded-md border border-secondary/30 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary transition hover:bg-secondary/5"
                    aria-label={`Copier le compte ${account.bank}`}
                  >
                    {isCopied ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-700" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-secondary" />
                    )}
                    {isCopied ? "Copié" : "Copier"}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs font-semibold text-primary/60">
            Besoin d&apos;aide ? info@centreculturel.cd
          </p>
        </div>
      </details>
    </div>
  );
}

function StatusPanel({
  status,
  detail,
}: {
  status: DonationStatus;
  detail: string;
}) {
  const isConfirmed = status === "succeeded";
  const isPending = status === "pending";
  const isFailed =
    status === "failed" || status === "cancelled" || status === "refunded";

  return (
    <div className="flex items-start gap-3 rounded-md border border-[#eadcc7] bg-white p-4">
      <div
        className={`grid h-10 w-10 flex-none place-items-center rounded-full ${
          isConfirmed
            ? "bg-green-100 text-green-800"
            : isFailed
            ? "bg-red-100 text-red-800"
            : "bg-secondary/12 text-primary"
        }`}
      >
        {isConfirmed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : isFailed ? (
          <XCircle className="h-5 w-5" />
        ) : isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <RefreshCw className="h-5 w-5" />
        )}
      </div>
      <div>
        <p className="text-sm font-bold uppercase text-primary">
          {formatDonationStatus(status)}
        </p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-primary/68">
          {detail}
        </p>
      </div>
    </div>
  );
}

function FundraisingShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      id="fundraising"
      className="relative overflow-hidden bg-[#f4efe4] py-16 text-primary sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/8 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/58">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Field({
  label,
  inputRef,
  value,
  onChange,
  placeholder,
  error,
  optional = false,
  type = "text",
}: {
  label: string;
  inputRef?: React.Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  optional?: boolean;
  type?: "text" | "email" | "tel";
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-secondary">
        {label}
        {optional && <span className="font-semibold normal-case">Optionnel</span>}
      </span>
      <input
        type={type}
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-md border border-[#eadcc7] bg-[#fdfbf6] px-4 text-sm font-semibold text-black outline-none transition placeholder:text-primary/35 focus:border-primary focus:bg-white"
      />
      {error && (
        <span className="mt-2 block text-xs font-semibold text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-secondary/35 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-primary transition hover:bg-[#f8f1e7] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function SummaryBar({
  label,
  amount,
  currency,
  actionLabel,
  disabled,
  onAction,
}: {
  label: string;
  amount: number;
  currency: string;
  actionLabel: string;
  disabled: boolean;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-primary p-4 text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Banknote className="h-5 w-5 text-[#ffcc02]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/58">
            {label}
          </p>
          <p className="text-xl font-bold">{formatMoney(amount || 0, currency)}</p>
        </div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ffcc02] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#3a2014] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#eadcc7] py-2 text-sm last:border-b-0">
      <span className="font-semibold text-secondary">{label}</span>
      <span className="text-right font-bold text-primary">{value}</span>
    </div>
  );
}

function FundraisingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start animate-pulse">
      {/* Left side: Campaign Info Card (Aside) */}
      <aside className="overflow-hidden rounded-lg bg-primary text-white shadow-2xl">
        <div className="relative min-h-[410px] p-6 sm:p-8 flex flex-col justify-end">
          {/* Badge skeleton */}
          <div className="mb-5 inline-flex h-8 w-44 rounded-full bg-white/10" />
          {/* Title skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-5/6 bg-white/10" />
            <Skeleton className="h-8 w-2/3 bg-white/10" />
          </div>
          {/* Description skeleton */}
          <div className="space-y-2 mt-5">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-4/5 bg-white/10" />
          </div>
        </div>

        {/* Stats and Impact */}
        <div className="grid gap-5 border-t border-white/12 p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-white/5 p-4 space-y-2">
              <Skeleton className="h-3 w-16 bg-white/10" />
              <Skeleton className="h-6 w-24 bg-white/10" />
            </div>
            <div className="rounded-md bg-white/5 p-4 space-y-2">
              <Skeleton className="h-3 w-16 bg-white/10" />
              <Skeleton className="h-6 w-24 bg-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32 bg-white/10" />
              <Skeleton className="h-3 w-8 bg-white/10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-white/10" />
            <Skeleton className="h-3 w-48 bg-white/10" />
          </div>

          <div className="space-y-3 border-t border-white/12 pt-4">
            <Skeleton className="h-4 w-36 bg-white/10" />
            <ul className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="flex gap-3">
                  <Skeleton className="h-4 w-4 rounded-full bg-white/10 flex-shrink-0" />
                  <Skeleton className="h-4 w-5/6 bg-white/10" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Right side: Donation Flow Card */}
      <div className="rounded-lg border border-[#d5b58d]/45 bg-white shadow-xl p-5 sm:p-7">
        <div className="space-y-5">
          <div>
            <Skeleton className="h-3 w-20 bg-secondary/15" />
            <Skeleton className="h-7 w-3/4 bg-primary/10 mt-2" />
          </div>

          {/* Steps indicator skeleton */}
          <div className="grid grid-cols-3 gap-1 rounded-md border border-secondary/10 bg-secondary/5 p-1 h-9" />

          {/* Donation options skeleton */}
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md border border-secondary/10 bg-secondary/5" />
            ))}
          </div>

          {/* Custom amount field skeleton */}
          <div className="h-20 rounded-md border border-secondary/10 bg-secondary/5" />

          {/* Summary bar skeleton */}
          <div className="h-16 rounded-md bg-primary/10" />
        </div>
      </div>
    </div>
  );
}
