"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  HandCoins,
  Landmark,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

type Step = "amount" | "identity" | "payment" | "confirmed";
type PaymentMethod = "mobile_money" | "card" | "transfer";

const campaignGoal = 517251;

const impactItems = [
  "561 m2 entierement amenages pour la lecture et la mediation.",
  "5 000 ouvrages initiaux, dont 3 000 pour la Bibliotheque.",
  "Outils numeriques de recherche et de formation.",
  "Ateliers, clubs de lecture et rencontres litteraires.",
];

const levels = [
  {
    name: "Partenaire Fondateur",
    range: "100 000 USD +",
    amount: 100000,
    note: "Engagement institutionnel majeur",
  },
  {
    name: "Grand Mecene",
    range: "50 000 - 99.99 USD",
    amount: 50000,
    note: "Soutien structurant de campagne",
  },
  {
    name: "Mecene Biblio Librairie",
    range: "25 000 - 49.99 USD",
    amount: 25000,
    note: "Collections, equipements et usages",
  },
  {
    name: "Parrain de Rayon",
    range: "5 000 - 24.99 USD",
    amount: 5000,
    note: "Rayon, collection ou espace dedie",
  },
  {
    name: "Ami & Citoyen",
    range: "100 - 4.99 USD",
    amount: 100,
    note: "Contribution ouverte a tous",
  },
];

const paymentMethods = [
  {
    id: "mobile_money" as const,
    title: "Mobile Money",
    detail: "M-Pesa, Orange Money, Airtel Money",
    icon: Phone,
  },
  {
    id: "card" as const,
    title: "Carte bancaire",
    detail: "Visa ou Mastercard",
    icon: CreditCard,
  },
  {
    id: "transfer" as const,
    title: "Virement bancaire",
    detail: "Rawbank, Equity BCDC, Ecobank",
    icon: Landmark,
  },
];

const bankAccounts = [
  { bank: "Rawbank", number: "CD48 05100051010120306000152" },
  { bank: "Equity BCDC", number: "00011150511200194697606 USD" },
  { bank: "Ecobank", number: "0026000013508010061362 USD" },
];

const formatUsd = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value);

export default function FundraisingSection() {
  const [step, setStep] = useState<Step>("amount");
  const [selectedLevel, setSelectedLevel] = useState(4);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("mobile_money");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedAmount = useMemo(() => {
    if (useCustomAmount) {
      return Number(customAmount) || 0;
    }

    return levels[selectedLevel].amount;
  }, [customAmount, selectedLevel, useCustomAmount]);

  const selectedLabel = useCustomAmount
    ? "Montant libre"
    : levels[selectedLevel].name;

  const progressPercent = Math.min(
    Math.round((selectedAmount / campaignGoal) * 100),
    100
  );

  const updateError = (field: string) => {
    if (!errors[field]) return;

    const nextErrors = { ...errors };
    delete nextErrors[field];
    setErrors(nextErrors);
  };

  const goToIdentity = () => {
    if (selectedAmount < 100) {
      setErrors({ amount: "Le montant minimum est de 100 USD." });
      return;
    }

    setErrors({});
    setStep("identity");
  };

  const goToPayment = () => {
    const nextErrors: Record<string, string> = {};

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

  const copyAccount = async (number: string) => {
    await navigator.clipboard.writeText(number);
    setCopiedAccount(number);
    window.setTimeout(() => setCopiedAccount(null), 1800);
  };

  return (
    <section className="relative overflow-hidden bg-[#f4efe4] py-16 text-primary sm:py-20 lg:py-24">
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
                  Soutien Biblio-Librairie
                </div>

                <h2 className="max-w-xl text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-4xl">
                  Investir dans la lecture, la jeunesse et la transmission
                </h2>

                <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-white/82 sm:text-base">
                  La Biblio-Librairie du Grand Tambour est un dispositif 
structurant au service de la jeunesse, de l éducation et 
de l inclusion culturelle à Kinshasa.
                </p>
              </div>
            </div>

            <div className="grid gap-5 border-t border-white/12 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-white/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/58">
                    Objectif
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatUsd(campaignGoal)}
                  </p>
                  <p className="text-xs font-semibold text-white/58">USD</p>
                </div>
                <div className="rounded-md bg-white/8 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/58">
                    Selection
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatUsd(selectedAmount || 0)}
                  </p>
                  <p className="text-xs font-semibold text-white/58">USD</p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/62">
                  <span>Impact estime</span>
                  <span>{progressPercent}% de l&apos;objectif</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/14">
                  <div
                    className="h-full rounded-full bg-[#ffcc02]"
                    style={{ width: `${Math.max(progressPercent, 3)}%` }}
                  />
                </div>
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
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a5f32]">
                    Parcours de contribution
                  </p>
                  <h3 className="mt-2 text-2xl font-bold uppercase leading-tight text-primary sm:text-3xl">
                    Choisir un niveau et preparer le don
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
                      (step === "payment" && index < 2) ||
                      step === "confirmed";

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
              {step === "amount" && (
                <div className="space-y-6">
                  <div className="grid gap-3">
                    {levels.map((level, index) => {
                      const isSelected =
                        selectedLevel === index && !useCustomAmount;

                      return (
                        <button
                          key={level.name}
                          type="button"
                          onClick={() => {
                            setSelectedLevel(index);
                            setUseCustomAmount(false);
                            setCustomAmount("");
                            setErrors({});
                          }}
                          className={`group grid gap-3 rounded-md border p-4 text-left transition duration-200 sm:grid-cols-[1fr_auto] sm:items-center ${
                            isSelected
                              ? "border-[#804423] bg-primary text-white shadow-lg"
                              : "border-[#eadcc7] bg-[#fdfbf6] text-primary hover:border-[#cd935b] hover:bg-white"
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-bold uppercase tracking-wide">
                              {level.name}
                            </span>
                            <span
                              className={`mt-1 block text-xs font-medium ${
                                isSelected
                                  ? "text-white/72"
                                  : "text-[#804423]/65"
                              }`}
                            >
                              {level.note}
                            </span>
                          </span>
                          <span
                            className={`rounded-md px-3 py-2 text-sm font-bold ${
                              isSelected
                                ? "bg-[#ffcc02] text-[#3a2014]"
                                : "bg-white text-[#804423] shadow-sm"
                            }`}
                          >
                            {level.range}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-md border border-dashed border-[#cd935b]/55 bg-[#f8f1e7] p-4">
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomAmount(true);
                        setErrors({});
                      }}
                      className="mb-3 flex w-full items-center justify-between gap-3 text-left"
                    >
                      <span>
                        <span className="block text-sm font-bold uppercase tracking-wide">
                          Montant libre
                        </span>
                        <span className="text-xs font-medium text-[#804423]/65">
                          Pour une contribution hors niveaux standards.
                        </span>
                      </span>
                      <span
                        className={`h-4 w-4 rounded-full border ${
                          useCustomAmount
                            ? "border-[#804423] bg-[#804423]"
                            : "border-[#804423]/35 bg-white"
                        }`}
                      />
                    </button>

                    <label className="relative block">
                      <span className="absolute inset-y-0 left-4 flex items-center text-xs font-bold text-[#804423]/55">
                        USD
                      </span>
                      <input
                        type="number"
                        min="100"
                        value={customAmount}
                        onFocus={() => setUseCustomAmount(true)}
                        onChange={(event) => {
                          setCustomAmount(event.target.value);
                          updateError("amount");
                        }}
                        placeholder="Saisir un montant"
                        className="h-12 w-full rounded-md border border-[#eadcc7] bg-white pl-14 pr-4 text-sm font-bold text-primary outline-none transition focus:border-[#804423]"
                      />
                    </label>
                    {errors.amount && (
                      <p className="mt-2 text-xs font-semibold text-red-700">
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <SummaryBar
                    label={selectedLabel}
                    amount={selectedAmount}
                    actionLabel="Continuer"
                    onAction={goToIdentity}
                  />
                </div>
              )}

              {step === "identity" && (
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <Field
                      label="Nom complet ou organisation"
                      value={fullName}
                      onChange={(value) => {
                        setFullName(value);
                        updateError("fullName");
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
                      }}
                      placeholder="contact@organisation.org"
                      error={errors.email}
                    />
                    <Field
                      label="Telephone"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      placeholder="+243 812 345 678"
                      optional
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SecondaryButton onClick={() => setStep("amount")}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </SecondaryButton>
                    <PrimaryButton onClick={goToPayment}>
                      Choisir le paiement
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
                          onClick={() => setPaymentMethod(method.id)}
                          className={`rounded-md border p-4 text-left transition ${
                            isSelected
                              ? "border-[#804423] bg-primary text-white shadow-lg"
                              : "border-[#eadcc7] bg-[#fdfbf6] text-primary hover:border-[#cd935b]"
                          }`}
                        >
                          <Icon
                            className={`mb-3 h-5 w-5 ${
                              isSelected ? "text-[#ffcc02]" : "text-[#9a5f32]"
                            }`}
                          />
                          <span className="block text-sm font-bold uppercase">
                            {method.title}
                          </span>
                          <span
                            className={`mt-1 block text-xs leading-relaxed ${
                              isSelected ? "text-white/72" : "text-[#804423]/65"
                            }`}
                          >
                            {method.detail}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === "transfer" && (
                    <div className="rounded-md border border-[#eadcc7] bg-[#f8f1e7] p-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#804423]/65">
                        Comptes disponibles
                      </p>
                      <div className="space-y-2">
                        {bankAccounts.map((account) => (
                          <div
                            key={account.number}
                            className="flex items-center justify-between gap-3 rounded-md bg-white p-3"
                          >
                            <div>
                              <p className="text-sm font-bold">{account.bank}</p>
                              <p className="break-all font-mono text-xs text-[#804423]/70">
                                {account.number}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyAccount(account.number)}
                              className="grid h-9 w-9 flex-none place-items-center rounded-md border border-[#eadcc7] text-[#804423] transition hover:bg-[#f4efe4]"
                              aria-label={`Copier le compte ${account.bank}`}
                            >
                              {copiedAccount === account.number ? (
                                <Check className="h-4 w-4 text-green-700" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-md border border-[#eadcc7] bg-white p-4">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <ReceiptLine label="Niveau" value={selectedLabel} />
                      <ReceiptLine
                        label="Montant"
                        value={`${formatUsd(selectedAmount)} USD`}
                      />
                      <ReceiptLine label="Donateur" value={fullName || "-"} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <SecondaryButton onClick={() => setStep("identity")}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </SecondaryButton>
                    <PrimaryButton onClick={() => setStep("confirmed")}>
                      Finaliser l&apos;aperçu
                      <ShieldCheck className="h-4 w-4" />
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {step === "confirmed" && (
                <div className="mx-auto max-w-lg py-8 text-center">
                  <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-800">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a5f32]">
                    Engagement confirme
                  </p>
                  <h4 className="mt-2 text-2xl font-bold uppercase text-primary">
                    Contribution preparee pour validation
                  </h4>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-[#804423]/72">
                    Votre choix de contribution est pret. L&apos;equipe CCAPAC peut
                    reprendre ces informations pour confirmer le canal de don et
                    accompagner la suite.
                  </p>

                  <div className="mt-6 rounded-md border border-[#eadcc7] bg-[#fdfbf6] p-4 text-left">
                    <ReceiptLine label="Niveau" value={selectedLabel} />
                    <ReceiptLine
                      label="Montant"
                      value={`${formatUsd(selectedAmount)} USD`}
                    />
                    <ReceiptLine label="Contact" value={email || "-"} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("amount")}
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-[#804423] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#5f321d]"
                  >
                    Revenir aux niveaux
                  </button>
                </div>
              )}
            </div>

            {step !== "confirmed" && (
              <div className="flex flex-col gap-3 border-t border-[#eadcc7] bg-[#fdfbf6] px-5 py-4 text-xs font-semibold text-[#804423]/65 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#9a5f32]" />
                  Canaux prevus : Mobile Money, carte bancaire et virement.
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#9a5f32]" />
                  info@centreculturel.cd
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  optional = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  optional?: boolean;
  type?: "text" | "email" | "tel";
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#804423]/68">
        {label}
        {optional && <span className="font-semibold normal-case">Optionnel</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-md border border-[#eadcc7] bg-[#fdfbf6] px-4 text-sm font-semibold text-primary outline-none transition placeholder:text-[#804423]/35 focus:border-[#804423] focus:bg-white"
      />
      {error && <span className="mt-2 block text-xs font-semibold text-red-700">{error}</span>}
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#804423] px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#5f321d] active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#d5b58d] bg-white px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#804423] transition hover:bg-[#f8f1e7]"
    >
      {children}
    </button>
  );
}

function SummaryBar({
  label,
  amount,
  actionLabel,
  onAction,
}: {
  label: string;
  amount: number;
  actionLabel: string;
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
          <p className="text-xl font-bold">{formatUsd(amount || 0)} USD</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ffcc02] px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#3a2014] transition hover:bg-white"
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
      <span className="font-semibold text-[#804423]/58">{label}</span>
      <span className="text-right font-bold text-primary">{value}</span>
    </div>
  );
}
