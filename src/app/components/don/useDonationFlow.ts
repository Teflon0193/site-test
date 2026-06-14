"use client";

import { useMemo, useRef, useState } from "react";
import type { MakutaOperatorCode } from "@/lib/makuta";
import { campaignConfig } from "./config";
import { confirmDonationOtp, createDonation } from "./makuta-client";
import { formatMoney } from "./formatters";
import { findOperator, getCategory } from "./operators";
import type {
  CreatedDonation,
  FundraisingErrors,
  PaymentCategory,
  Step,
} from "./types";

const THANK_YOU_PATH = "/faire-un-don/merci";
const LAST_TRANSACTION_KEY = "ccapac.last_transaction_id";
const phonePattern = /^\+243\d{9}$/;
const emailPattern = /\S+@\S+\.\S+/;

export function useDonationFlow() {
  const campaign = campaignConfig;
  const tiers = campaign.tiers;
  const currency = campaign.currency;

  const [step, setStep] = useState<Step>("identity");
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    tiers.at(-1)?.id ?? null
  );
  const [customAmount, setCustomAmount] = useState("");
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [category, setCategory] = useState<PaymentCategory>("mobile_money");
  const [operatorCode, setOperatorCode] = useState<MakutaOperatorCode | null>(
    getCategory("mobile_money").operators[0]?.code ?? null
  );
  const [accountNumber, setAccountNumber] = useState("");

  const [errors, setErrors] = useState<FundraisingErrors>({});
  const [checkoutError, setCheckoutError] = useState("");
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const [otpDonation, setOtpDonation] = useState<CreatedDonation | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isConfirmingOtp, setIsConfirmingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const fullNameInputRef = useRef<HTMLInputElement | null>(null);
  const amountActionRef = useRef<HTMLDivElement | null>(null);

  const selectedTier = tiers.find((tier) => tier.id === selectedTierId);
  const minimumAmount = tiers.length
    ? Math.min(...tiers.map((tier) => tier.minAmount))
    : 0;
  const activeCategory = getCategory(category);
  const activeOperator = findOperator(operatorCode);

  const selectedAmount = useMemo(() => {
    if (useCustomAmount) return Number(customAmount) || 0;
    return selectedTier?.minAmount || minimumAmount;
  }, [customAmount, minimumAmount, selectedTier?.minAmount, useCustomAmount]);

  const selectedLabel = useCustomAmount
    ? "Montant libre"
    : selectedTier?.name || "Contribution";

  const progressPercent = campaign.stats
    ? Math.min(Math.max(campaign.stats.progressPercent, 0), 100)
    : null;

  const updateError = (field: string) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const clearStepFeedback = () => {
    setErrors({});
    setCheckoutError("");
  };

  const clearCheckoutError = () => setCheckoutError("");

  const scrollToAmountAction = () => {
    window.requestAnimationFrame(() => {
      amountActionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const focusFullName = () => {
    window.requestAnimationFrame(() => {
      fullNameInputRef.current?.focus({ preventScroll: true });
    });
  };

  const goToIdentity = () => {
    clearStepFeedback();
    setStep("identity");
    focusFullName();
  };

  const goToAmount = () => {
    const nextErrors: FundraisingErrors = {};
    setCheckoutError("");

    if (!fullName.trim()) {
      nextErrors.fullName =
        "Le nom du donateur ou de l'organisation est requis.";
    }

    if (!email.trim() || !emailPattern.test(email)) {
      nextErrors.email = "Veuillez renseigner une adresse e-mail valide.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStep("amount");
  };

  const goBackToAmount = () => {
    clearStepFeedback();
    setStep("amount");
  };

  const goToPayment = () => {
    setCheckoutError("");

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
    setStep("payment");
  };

  const selectCategory = (next: PaymentCategory) => {
    setCategory(next);
    setOperatorCode(getCategory(next).operators[0]?.code ?? null);
    setAccountNumber("");
    clearCheckoutError();
    updateError("accountNumber");
  };

  const selectOperator = (code: MakutaOperatorCode) => {
    setOperatorCode(code);
    clearCheckoutError();
  };

  const redirectToThankYou = (transactionId: string) => {
    window.location.assign(
      `${THANK_YOU_PATH}?transaction_id=${encodeURIComponent(transactionId)}`
    );
  };

  const validatePaymentInputs = () => {
    if (!operatorCode) {
      setCheckoutError("Veuillez choisir un opérateur de paiement.");
      return false;
    }

    const normalizedAccount = accountNumber.replace(/[\s-]/g, "");

    if (!normalizedAccount) {
      setErrors({ accountNumber: `${activeCategory.accountLabel} est requis.` });
      return false;
    }

    if (category === "mobile_money" && !phonePattern.test(normalizedAccount)) {
      setErrors({
        accountNumber:
          "Entrez un numéro valide au format +243 suivi de 9 chiffres.",
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const createCheckout = async () => {
    setCheckoutError("");

    if (!validatePaymentInputs() || !operatorCode) return;

    setIsCreatingCheckout(true);

    try {
      const donation = await createDonation({
        amount: selectedAmount,
        operator: operatorCode,
        accountNumber: accountNumber.replace(/[\s-]/g, ""),
        donor: { name: fullName, email, phone },
      });

      try {
        sessionStorage.setItem(LAST_TRANSACTION_KEY, donation.transactionId);
      } catch {
        // sessionStorage indisponible : la référence reste dans l'URL.
      }

      if (donation.requiresOtp) {
        setOtpDonation(donation);
        setOtpError("");
        setIsOtpModalOpen(true);
        setIsCreatingCheckout(false);
        return;
      }

      if (donation.redirectUrl) {
        window.location.assign(donation.redirectUrl);
        return;
      }

      // Mobile Money / virement : la confirmation est suivie sur la page de
      // remerciement (qui interroge le statut jusqu'à confirmation).
      redirectToThankYou(donation.transactionId);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Le paiement ne peut pas être démarré pour le moment."
      );
      setIsCreatingCheckout(false);
    }
  };

  const submitOtp = async (otpCode: string) => {
    if (!otpDonation) return;

    setIsConfirmingOtp(true);
    setOtpError("");

    try {
      const result = await confirmDonationOtp(otpDonation.transactionId, otpCode);

      if (result.status === "succeeded" || result.status === "pending") {
        redirectToThankYou(otpDonation.transactionId);
        return;
      }

      setOtpError("Le paiement n'a pas pu être confirmé. Réessayez.");
    } catch (error) {
      setOtpError(
        error instanceof Error
          ? error.message
          : "Le code de confirmation n'a pas pu être validé."
      );
    } finally {
      setIsConfirmingOtp(false);
    }
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtpDonation(null);
    setOtpError("");
    setIsCreatingCheckout(false);
  };

  return {
    // campagne
    campaign,
    tiers,
    currency,
    minimumAmount,
    progressPercent,
    // étape
    step,
    // montant
    selectedTierId,
    setSelectedTierId,
    customAmount,
    setCustomAmount,
    useCustomAmount,
    setUseCustomAmount,
    selectedAmount,
    selectedLabel,
    // identité
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    fullNameInputRef,
    amountActionRef,
    // paiement
    category,
    selectCategory,
    operatorCode,
    selectOperator,
    activeCategory,
    activeOperator,
    accountNumber,
    setAccountNumber,
    // navigation
    goToIdentity,
    goToAmount,
    goBackToAmount,
    goToPayment,
    scrollToAmountAction,
    // soumission
    createCheckout,
    isCreatingCheckout,
    // OTP
    otpDonation,
    isOtpModalOpen,
    isConfirmingOtp,
    otpError,
    submitOtp,
    closeOtpModal,
    // feedback
    errors,
    checkoutError,
    updateError,
    clearStepFeedback,
    clearCheckoutError,
  };
}
