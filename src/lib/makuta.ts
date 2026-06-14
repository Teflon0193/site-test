
export type MakutaOperatorCode =
  | "DRC_MPESA"
  | "DRC_AIRTEL_MONEY"
  | "DRC_ORANGE_MONEY"
  | "DRC_AFRIMONEY"
  | "DRC_RAKKACASH"
  | "DRC_FIRSTBANK"
  | "DRC_ECOBANKPAY"
  | "DRC_FINCA"
  | "DRC_VISA_CP"
  | "DRC_VISA_CNP";

/** Statut interne normalisé (mapping depuis les codes Makuta TS/TF/TP). */
export type MakutaDonationStatus = "pending" | "succeeded" | "failed";

/** Codes de statut bruts renvoyés par Makuta (guide §8.5). */
export type MakutaRawStatus = "TS" | "TF" | "TP";

export type CreateMakutaTransactionInput = {
  operator: MakutaOperatorCode;
  /** Numéro Mobile Money / compte / téléphone du client. */
  accountNumber: string;
  currency: string;
  amount: number;
  /** Référence unique générée par notre système (idempotence côté Makuta). */
  thirdPartyReference: string;
  /** Description / objet du paiement. */
  reason: string;
  /** Requis uniquement pour DRC_VISA_CNP. */
  email?: string;
};

export type MakutaTransaction = {
  /** Identifiant Makuta de la transaction. */
  id: string;
  thirdPartyReference: string;
  status: MakutaDonationStatus;
  currency: string;
  amount: number;
  /** URL de redirection sécurisée (Visa CNP — guide §6). */
  redirectUrl: string | null;
  /** Vrai si l'opérateur exige une confirmation OTP (ex. Rakkacash — guide §7). */
  requiresOtp: boolean;
  /** Message lisible renvoyé par la passerelle, le cas échéant. */
  message: string | null;
};

export class MakutaApiError extends Error {
  status: number;
  code: string;

  constructor({
    status,
    code,
    message,
  }: {
    status: number;
    code: string;
    message: string;
  }) {
    super(message);
    this.name = "MakutaApiError";
    this.status = status;
    this.code = code;
  }
}

/** Mode mock : actif par défaut tant que l'intégration réelle n'est pas câblée. */
export function isMakutaMockEnabled() {
  return process.env.MAKUTA_MOCK !== "false";
}

/** Mappe les codes de statut bruts Makuta (TS/TF/TP) vers notre statut interne. */
export function mapMakutaStatus(raw: MakutaRawStatus): MakutaDonationStatus {
  if (raw === "TS") return "succeeded";
  if (raw === "TF") return "failed";
  return "pending";
}

/**
 * OAuth2 client_credentials → access_token (guide §3).
 * Le token expire après 300 s : prévoir un cache/renouvellement à l'intégration.
 */
export async function getAccessToken(): Promise<string> {
  if (isMakutaMockEnabled()) {
    return "mock-access-token";
  }

  // TODO(makuta §3): POST {MAKUTA_AUTH_BASE_URL}/oauth2/token
  //   Headers: Authorization: Basic base64(client_id:client_secret),
  //            Content-Type: application/x-www-form-urlencoded
  //   Body: grant_type=client_credentials&scope={MAKUTA_SCOPE}
  //   → renvoyer data.access_token (penser à mettre en cache ~280 s).
  throw new MakutaApiError({
    status: 501,
    code: "not_implemented",
    message: "Intégration Makuta non disponible (authentification).",
  });
}

/**
 * Signature RSA SHA-256 / PKCS#1 v1.5, encodée Base64 → en-tête X-Signature (guide §4).
 * - POST : signer le corps JSON compact (sans espaces ni retours ligne).
 * - GET  : signer le chemin de la requête.
 */
export function signRequest(payload: string): string {
  if (isMakutaMockEnabled()) {
    // Signature factice mais déterministe (dépend du contenu) — non sécurisée.
    return Buffer.from(payload).toString("base64").slice(0, 24);
  }

  // TODO(makuta §4): charger MAKUTA_PRIVATE_KEY (PEM) puis
  //   crypto.createSign("RSA-SHA256").update(payload).sign(privateKey, "base64")
  //   (padding PKCS#1 v1.5 — comportement par défaut de Node pour les clés RSA).
  throw new MakutaApiError({
    status: 501,
    code: "not_implemented",
    message: "Intégration Makuta non disponible (signature).",
  });
}

/**
 * Création d'une transaction C2B (guide §5).
 * Renvoie une transaction normalisée incluant `redirectUrl` (Visa CNP) et
 * `requiresOtp` (Rakkacash) afin que l'UI sache quelle branche suivre.
 */
export async function createTransaction(
  input: CreateMakutaTransactionInput
): Promise<MakutaTransaction> {
  if (isMakutaMockEnabled()) {
    return mockCreateTransaction(input);
  }

  // TODO(makuta §5):
  //   const token = await getAccessToken();
  //   const body = JSON.stringify({ operator, accountNumber, currency, amount,
  //     thirdPartyReference, reason, ...(operator === "DRC_VISA_CNP" ? { email } : {}) });
  //   POST {MAKUTA_API_BASE_URL}/api/transactions/ctob
  //   Headers: Authorization: Bearer {token}, Content-Type: application/json,
  //            X-Signature: signRequest(body), X-Extension: {MAKUTA_EXTENSION}
  //   → normaliser la réponse vers MakutaTransaction :
  //       redirectUrl = data.url ?? null            (Visa CNP, guide §6)
  //       requiresOtp = operator === "DRC_RAKKACASH" (guide §7)
  //       status      = "pending" à la création (confirmé via getTransaction/callback)
  throw new MakutaApiError({
    status: 501,
    code: "not_implemented",
    message: "Intégration Makuta non disponible (création de transaction).",
  });
}

/**
 * Confirmation OTP pour les opérateurs qui l'exigent (Rakkacash — guide §7).
 */
export async function confirmOtp(
  transactionId: string,
  otpCode: string
): Promise<MakutaTransaction> {
  if (isMakutaMockEnabled()) {
    return mockConfirmOtp(transactionId, otpCode);
  }

  // TODO(makuta §7): POST {MAKUTA_API_BASE_URL}/api/rakkacash-confirm-otp-txn
  //   Headers: Bearer token + X-Signature(body) + X-Extension
  //   Body: { transactionId, otpCode }
  //   → 400 si OTP invalide/expiré ; sinon re-lire le statut via getTransaction().
  throw new MakutaApiError({
    status: 501,
    code: "not_implemented",
    message: "Intégration Makuta non disponible (confirmation OTP).",
  });
}

/**
 * Récupération du statut d'une transaction (guide §8). Mappe TS/TF/TP.
 */
export async function getTransaction(
  transactionId: string
): Promise<MakutaTransaction> {
  if (isMakutaMockEnabled()) {
    return mockGetTransaction(transactionId);
  }

  // TODO(makuta §8): GET {MAKUTA_API_BASE_URL}/api/transactions/{transactionId}
  //   Headers: Bearer token (scope txn) + X-Signature(requestPath) + X-Extension
  //   → status = mapMakutaStatus(data.status as MakutaRawStatus)
  throw new MakutaApiError({
    status: 501,
    code: "not_implemented",
    message: "Intégration Makuta non disponible (statut de transaction).",
  });
}

/**
 * Réponse d'erreur normalisée pour les routes API (calqué sur aksessifyErrorResponse).
 */
export function makutaErrorResponse(error: unknown) {
  if (error instanceof MakutaApiError) {
    return {
      body: { error: { code: error.code, message: error.message } },
      status: error.status,
    };
  }

  console.error("[Makuta] Erreur inattendue:", error);

  return {
    body: {
      error: {
        code: "internal_error",
        message: "Le paiement ne peut pas être traité pour le moment.",
      },
    },
    status: 500,
  };
}

/* -------------------------------------------------------------------------- */
/* Mock — simule le parcours complet pour permettre la démonstration de l'UI. */
/* À supprimer/désactiver (MAKUTA_MOCK=false) une fois l'intégration réelle    */
/* branchée ci-dessus.                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Le statut mock est dérivé de l'horodatage encodé dans l'id : une transaction
 * passe de `pending` à `succeeded` après MOCK_SETTLE_MS, ce qui permet de tester
 * le polling et les états d'attente sans backend.
 */
const MOCK_SETTLE_MS = 6000;

function mockCreateTransaction(
  input: CreateMakutaTransactionInput
): MakutaTransaction {
  const isVisaCnp = input.operator === "DRC_VISA_CNP";
  const requiresOtp = input.operator === "DRC_RAKKACASH";
  // L'id encode l'instant de création pour calculer un statut différé.
  const id = `mock_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  return {
    id,
    thirdPartyReference: input.thirdPartyReference,
    status: "pending",
    currency: input.currency,
    amount: input.amount,
    // En mock, on redirige vers la page de remerciement (en prod : URL Makuta Visa).
    redirectUrl: isVisaCnp
      ? `/faire-un-don/merci?transaction_id=${encodeURIComponent(id)}`
      : null,
    requiresOtp,
    message: null,
  };
}

function mockConfirmOtp(
  transactionId: string,
  otpCode: string
): MakutaTransaction {
  const settled: MakutaTransaction = {
    id: transactionId,
    thirdPartyReference: transactionId,
    status: "succeeded",
    currency: "USD",
    amount: 0,
    redirectUrl: null,
    requiresOtp: true,
    message: "Paiement confirmé.",
  };

  // En mock, tout code à 6 chiffres est accepté ; le reste échoue.
  if (!/^\d{6}$/.test(otpCode)) {
    throw new MakutaApiError({
      status: 400,
      code: "invalid_otp",
      message: "Code de confirmation invalide ou expiré.",
    });
  }

  return settled;
}

function mockGetTransaction(transactionId: string): MakutaTransaction {
  const createdAt = decodeMockTimestamp(transactionId);
  const settled =
    createdAt !== null && Date.now() - createdAt >= MOCK_SETTLE_MS;

  return {
    id: transactionId,
    thirdPartyReference: transactionId,
    status: settled ? "succeeded" : "pending",
    currency: "USD",
    amount: 0,
    redirectUrl: null,
    requiresOtp: false,
    message: null,
  };
}

function decodeMockTimestamp(id: string): number | null {
  const part = id.split("_")[1];
  if (!part) return null;

  const value = parseInt(part, 36);
  return Number.isNaN(value) ? null : value;
}
