"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  HandCoins,
  Landmark,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { OtpDialog } from "./OtpDialog";
import {
  bankAccounts,
  contactInfo,
  impactItems,
} from "./config";
import { formatMoney, formatTierRange } from "./formatters";
import { paymentCategories } from "./operators";
import { useDonationFlow } from "./useDonationFlow";
import {
  Field,
  PrimaryButton,
  ReceiptLine,
  SecondaryButton,
  StatCard,
  Stepper,
  SummaryBar,
} from "./ui";

export default function DonationExperience() {
  const flow = useDonationFlow();
  const { campaign, currency } = flow;

  return (
    <section
      id="faire-un-don"
      className="relative overflow-hidden bg-[#f4efe4] py-16 text-primary sm:py-20 lg:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-36 bg-primary" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          {/* Colonne campagne */}
          <aside className="overflow-hidden rounded-lg bg-primary text-white shadow-2xl">
            <div className="relative min-h-[410px]">
              <Image
                src={campaign.coverImage}
                alt={campaign.coverImageAlt}
                fill
                className="object-cover opacity-72"
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25150e] via-[#25150e]/68 to-[#25150e]/8" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-md">
                  <HandCoins className="h-4 w-4 text-[#ffcc02]" />
                  Collecte en cours
                </div>

                <h2 className="max-w-xl text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                  {campaign.title}
                </h2>

                {campaign.description && (
                  <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-white/82 sm:text-base">
                    {campaign.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 border-t border-white/12 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Objectif"
                  value={formatMoney(campaign.goalAmount, currency)}
                />
                <StatCard
                  label="Collecte"
                  value={
                    campaign.stats
                      ? formatMoney(campaign.stats.raisedAmount, currency)
                      : "—"
                  }
                />
              </div>

              {flow.progressPercent !== null && campaign.stats && (
                <div>
                  <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/62">
                    <span>Progression de la collecte</span>
                    <span>{flow.progressPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/14">
                    <div
                      className="h-full rounded-full bg-[#ffcc02]"
                      style={{ width: `${Math.max(flow.progressPercent, 2)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs font-medium text-white/62">
                    {campaign.stats.succeededDonationsCount} dons confirmés par{" "}
                    {campaign.stats.uniqueDonorsCount} donateurs.
                  </p>
                </div>
              )}

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

          {/* Carte formulaire */}
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
                <Stepper step={flow.step} />
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {flow.step === "identity" && <IdentityStep flow={flow} />}
              {flow.step === "amount" && <AmountStep flow={flow} />}
              {flow.step === "payment" && <PaymentStep flow={flow} />}
            </div>

            <div className="flex flex-col gap-3 border-t border-[#eadcc7] bg-[#fdfbf6] px-5 py-4 text-xs font-semibold text-primary/65 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-secondary" />
                Paiement sécurisé
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                {contactInfo.email}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                {contactInfo.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      <OtpDialog
        open={flow.isOtpModalOpen}
        isConfirming={flow.isConfirmingOtp}
        error={flow.otpError}
        onSubmit={flow.submitOtp}
        onClose={flow.closeOtpModal}
      />
    </section>
  );
}

type Flow = ReturnType<typeof useDonationFlow>;

function IdentityStep({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Field
          label="Nom complet ou organisation"
          inputRef={flow.fullNameInputRef}
          value={flow.fullName}
          onChange={(value) => {
            flow.setFullName(value);
            flow.updateError("fullName");
            flow.clearCheckoutError();
          }}
          placeholder="Ex. Fondation CCAPAC"
          error={flow.errors.fullName}
          autoComplete="name"
        />
        <Field
          label="Adresse e-mail"
          type="email"
          inputMode="email"
          value={flow.email}
          onChange={(value) => {
            flow.setEmail(value);
            flow.updateError("email");
            flow.clearCheckoutError();
          }}
          placeholder="contact@organisation.org"
          error={flow.errors.email}
          autoComplete="email"
        />
        <Field
          label="Téléphone"
          type="tel"
          inputMode="tel"
          value={flow.phone}
          onChange={(value) => {
            flow.setPhone(value);
            flow.clearCheckoutError();
          }}
          placeholder="+243 812 345 678"
          optional
          autoComplete="tel"
        />
      </div>

      <PrimaryButton onClick={flow.goToAmount}>
        Continuer
        <ArrowRight className="h-4 w-4" />
      </PrimaryButton>
    </div>
  );
}

function AmountStep({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {flow.tiers.map((tier) => {
          const isSelected =
            flow.selectedTierId === tier.id && !flow.useCustomAmount;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => {
                flow.setSelectedTierId(tier.id);
                flow.setUseCustomAmount(false);
                flow.setCustomAmount("");
                flow.clearStepFeedback();
                flow.scrollToAmountAction();
              }}
              className={`group grid gap-3 rounded-md border p-4 text-left transition duration-200 sm:grid-cols-[1fr_auto] sm:items-center ${
                isSelected
                  ? "border-primary bg-primary text-white shadow-lg"
                  : "border-[#eadcc7] bg-[#fdfbf6] text-primary hover:border-secondary hover:bg-white"
              }`}
            >
              <span>
                <span
                  className={`block text-sm font-bold uppercase tracking-wide ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
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
                {formatTierRange(tier.minAmount, tier.maxAmount, flow.currency)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-md border border-dashed border-secondary/55 bg-[#f8f1e7] p-4">
        <button
          type="button"
          onClick={() => {
            flow.setUseCustomAmount(true);
            flow.clearStepFeedback();
            flow.scrollToAmountAction();
          }}
          className="mb-3 flex w-full items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="block text-sm font-bold uppercase tracking-wide">
              Montant libre
            </span>
            <span className="text-xs font-medium text-primary/65">
              À partir de {formatMoney(flow.minimumAmount, flow.currency)}.
            </span>
          </span>
          <span
            className={`h-4 w-4 rounded-full border ${
              flow.useCustomAmount
                ? "border-primary bg-primary"
                : "border-primary/35 bg-white"
            }`}
          />
        </button>

        <label className="relative block">
          <span className="absolute inset-y-0 left-4 flex items-center text-xs font-bold text-primary/55">
            {flow.currency}
          </span>
          <input
            type="number"
            min={flow.minimumAmount}
            value={flow.customAmount}
            onFocus={() => flow.setUseCustomAmount(true)}
            onChange={(event) => {
              flow.setCustomAmount(event.target.value);
              flow.updateError("amount");
              flow.clearCheckoutError();
            }}
            placeholder="Saisir un montant"
            className="h-12 w-full rounded-md border border-[#eadcc7] bg-white pl-16 pr-4 text-sm font-bold text-primary outline-none transition focus:border-primary"
          />
        </label>
        {flow.errors.amount && (
          <p className="mt-2 text-xs font-semibold text-red-700">
            {flow.errors.amount}
          </p>
        )}
      </div>

      <div ref={flow.amountActionRef}>
        <div className="mb-3">
          <SecondaryButton onClick={flow.goToIdentity}>
            <ArrowLeft className="h-4 w-4" />
            Retour
          </SecondaryButton>
        </div>
        <SummaryBar
          label={flow.selectedLabel}
          amount={flow.selectedAmount}
          currency={flow.currency}
          actionLabel="Continuer"
          onAction={flow.goToPayment}
        />
      </div>
    </div>
  );
}

function PaymentStep({ flow }: { flow: Flow }) {
  return (
    <div className="space-y-6">
      {/* Catégories */}
      <div className="grid gap-3 sm:grid-cols-3">
        {paymentCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = flow.category === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => flow.selectCategory(cat.id)}
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
                {cat.title}
              </span>
              <span
                className={`mt-1 block text-xs leading-relaxed ${
                  isSelected ? "text-white/72" : "text-secondary/65"
                }`}
              >
                {cat.detail}
              </span>
            </button>
          );
        })}
      </div>

      {/* Choix de l'opérateur */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-secondary">
          {flow.category === "card" ? "Réseau" : "Opérateur"}
        </p>
        <div className="flex flex-wrap gap-2">
          {flow.activeCategory.operators.map((operator) => {
            const isSelected = flow.operatorCode === operator.code;

            return (
              <button
                key={operator.code}
                type="button"
                onClick={() => flow.selectOperator(operator.code)}
                className={`rounded-md border px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-[#eadcc7] bg-[#fdfbf6] text-primary hover:border-secondary"
                }`}
              >
                {operator.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Champ compte payeur */}
      <div className="rounded-md border border-secondary/25 bg-[#f8f1e7] p-4">
        <Field
          id="don-account-number"
          label={flow.activeCategory.accountLabel}
          type="tel"
          inputMode="tel"
          value={flow.accountNumber}
          onChange={(value) => {
            flow.setAccountNumber(value);
            flow.updateError("accountNumber");
            flow.clearCheckoutError();
          }}
          placeholder={flow.activeCategory.accountPlaceholder}
          hint={flow.activeCategory.accountHint}
          error={flow.errors.accountNumber}
        />
      </div>

      {/* Récapitulatif */}
      <div className="rounded-md border border-[#eadcc7] bg-white p-4">
        <div className="grid gap-1 text-sm sm:grid-cols-3 sm:gap-3">
          <ReceiptLine label="Niveau" value={flow.selectedLabel} />
          <ReceiptLine
            label="Montant"
            value={formatMoney(flow.selectedAmount, flow.currency)}
          />
          <ReceiptLine
            label="Moyen"
            value={flow.activeOperator?.label || flow.activeCategory.title}
          />
        </div>
      </div>

      {flow.checkoutError && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {flow.checkoutError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SecondaryButton
          disabled={flow.isCreatingCheckout}
          onClick={flow.goBackToAmount}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </SecondaryButton>
        <PrimaryButton
          disabled={flow.isCreatingCheckout}
          onClick={flow.createCheckout}
        >
          {flow.isCreatingCheckout
            ? "Préparation du paiement..."
            : "Finaliser le don"}
          <ShieldCheck className="h-4 w-4" />
        </PrimaryButton>
      </div>

      <BankTransferInfo />
    </div>
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
                Vous préférez un virement bancaire manuel ?
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
            Le virement manuel est une alternative aux paiements en ligne.
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
            Besoin d&apos;aide ? {contactInfo.email}
          </p>
        </div>
      </details>
    </div>
  );
}
