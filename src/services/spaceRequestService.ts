import api from "@/lib/api";

export type SpaceRequestDocumentType =
  | "INITIAL_REQUEST"
  | "ARTISTIC_OPINION"
  | "LEGAL_DOCUMENT"
  | "FINANCE_QUOTE"
  | "PAYMENT_PROOF";

export interface CreateSpaceRequestData {
  fullName: string;
  email: string;
  phone?: string;
  eventName: string;
  space: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  participants?: number;
  description?: string;
}

export interface SpaceRequestDocument {
  id?: number;
  requestId?: number;

  type?: SpaceRequestDocumentType;

  name: string;
  url: string;

  mimeType?: string;
  size: number;

  uploadedAt?: string;

  uploadedBy?: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export interface SpaceRequestUser {
  id: number;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
}

export interface HistoryPerformedBy {
  id?: number;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface ValidationHistory {
  id: number;
  action: string;

  previousStatus?: string | null;
  newStatus: string;

  fromDepartment?: string | null;
  toDepartment?: string | null;

  comment?: string | null;

  electronicSignature?: string | null;

  performedAt: string;

  performedBy?: HistoryPerformedBy | null;
}

export interface SpaceRequest {
  id: number;
  reference: string;

  eventName: string;
  title?: string;

  description?: string;

  date?: string | null;
  desiredDate?: string | null;

  status: string;

  currentDepartment: string;
  assignedDepartment?: string;

  currentStep?: string | null;

  electronicSignature?: string | null;
  rejectionComment?: string | null;

  paymentAmount?: number | null;

  submittedAt?: string | null;

  /*
   * Ancien document conservé pour
   * compatibilité avec les anciennes pages.
   */
  document?: SpaceRequestDocument | null;

  /*
   * Nouvelle collection de documents.
   */
  documents?: SpaceRequestDocument[];

  user?: SpaceRequestUser | null;

  createdAt: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

function validateRequestId(id: number) {
  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      "Identifiant de demande invalide."
    );
  }
}

function requireSignature(
  electronicSignature: string
) {
  const signature =
    electronicSignature.trim();

  if (signature.length < 3) {
    throw new Error(
      "La signature électronique est obligatoire."
    );
  }

  return signature;
}

function requireDocument(
  document: File
) {
  if (!document) {
    throw new Error(
      "Le document est obligatoire."
    );
  }

  const maximumSize =
    10 * 1024 * 1024;

  if (document.size > maximumSize) {
    throw new Error(
      "Le document ne doit pas dépasser 10 Mo."
    );
  }

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const fileName =
    document.name.toLowerCase();

  const validExtension =
    allowedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    );

  if (!validExtension) {
    throw new Error(
      "Seuls les fichiers PDF, DOC et DOCX sont autorisés."
    );
  }
}

const documentEndpoints: Record<
  Exclude<
    SpaceRequestDocumentType,
    "INITIAL_REQUEST"
  >,
  string
> = {
  ARTISTIC_OPINION:
    "artistic-opinion",

  LEGAL_DOCUMENT:
    "legal-document",

  FINANCE_QUOTE:
    "finance-quote",

  PAYMENT_PROOF:
    "payment-proof",
};

export const spaceRequestService = {
  async create(
    data: CreateSpaceRequestData,
    document: File
  ): Promise<SpaceRequest> {
    requireDocument(document);

    if (!data.fullName.trim()) {
      throw new Error(
        "Le nom complet est obligatoire."
      );
    }

    if (!data.email.trim()) {
      throw new Error(
        "L’adresse email est obligatoire."
      );
    }

    if (!data.eventName.trim()) {
      throw new Error(
        "L’intitulé de l’activité est obligatoire."
      );
    }

    if (!data.date) {
      throw new Error(
        "La date souhaitée est obligatoire."
      );
    }

    const formData = new FormData();

    formData.append(
      "document",
      document,
      document.name
    );

    formData.append(
      "fullName",
      data.fullName.trim()
    );

    formData.append(
      "email",
      data.email.trim().toLowerCase()
    );

    formData.append(
      "phone",
      data.phone?.trim() || ""
    );

    formData.append(
      "eventName",
      data.eventName.trim()
    );

    formData.append(
      "space",
      String(data.space)
    );

    formData.append(
      "date",
      data.date
    );

    formData.append(
      "startTime",
      data.startTime || ""
    );

    formData.append(
      "endTime",
      data.endTime || ""
    );

    formData.append(
      "participants",
      String(data.participants || 1)
    );

    formData.append(
      "description",
      data.description?.trim() || ""
    );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >("/space-requests", formData);

    return response.data.data;
  },

  async getMyRequests(): Promise<
    SpaceRequest[]
  > {
    const response = await api.get<
      ApiResponse<SpaceRequest[]>
    >("/space-requests/my");

    return response.data.data;
  },

  async getDepartmentRequests(): Promise<
    SpaceRequest[]
  > {
    const response = await api.get<
      ApiResponse<SpaceRequest[]>
    >("/space-requests/department");

    return response.data.data;
  },

  async getDepartmentHistory(): Promise<
    SpaceRequest[]
  > {
    const response = await api.get<
      ApiResponse<SpaceRequest[]>
    >("/space-requests/department/history");

    return response.data.data;
  },

  async getOne(
    id: number
  ): Promise<SpaceRequest> {
    validateRequestId(id);

    const response = await api.get<
      ApiResponse<SpaceRequest>
    >(`/space-requests/${id}`);

    return response.data.data;
  },

  async getHistory(
    id: number
  ): Promise<ValidationHistory[]> {
    validateRequestId(id);

    const response = await api.get<
      ApiResponse<ValidationHistory[]>
    >(`/space-requests/${id}/histories`);

    return response.data.data;
  },

  /*
   * Charge les documents disponibles
   * pour une demande.
   */
  async getDocuments(
  id: number
): Promise<SpaceRequestDocument[]> {
  validateRequestId(id);

  const response = await api.get<
    ApiResponse<
      Array<
        SpaceRequestDocument & {
          document_type?: SpaceRequestDocumentType;
          documentType?: SpaceRequestDocumentType;
        }
      >
    >
  >(`/space-requests/${id}/documents`);

  return response.data.data.map(
    (document) => ({
      ...document,

      type:
        document.type ||
        document.documentType ||
        document.document_type,
    })
  );
},

  /*
   * Ajoute l’avis artistique,
   * le document juridique ou
   * la cotation financière.
   */
  async uploadDocument(
    id: number,
    type: Exclude<
      SpaceRequestDocumentType,
      "INITIAL_REQUEST"
    >,
    document: File
  ): Promise<SpaceRequestDocument> {
    validateRequestId(id);
    requireDocument(document);

    const endpoint =
      documentEndpoints[type];

    if (!endpoint) {
      throw new Error(
        "Type de document invalide."
      );
    }

    const formData = new FormData();

    formData.append(
      "document",
      document,
      document.name
    );

    const response = await api.post<
      ApiResponse<SpaceRequestDocument>
    >(
      `/space-requests/${id}/documents/${endpoint}`,
      formData
    );

    return response.data.data;
  },

  /*
   * Signature initiale du demandeur.
   */
  async submit(
    id: number,
    electronicSignature: string
  ): Promise<SpaceRequest> {
    validateRequestId(id);

    const signature =
      requireSignature(
        electronicSignature
      );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >(`/space-requests/${id}/submit`, {
      electronicSignature: signature,
    });

    return response.data.data;
  },

  /*
   * Confirmation des deux documents :
   * formulaire initial + avis artistique.
   *
   * Aucun nouveau fichier n’est créé.
   */
  async confirmMember(
    id: number,
    electronicSignature: string,
    comment = ""
  ): Promise<SpaceRequest> {
    validateRequestId(id);

    const signature =
      requireSignature(
        electronicSignature
      );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >(`/space-requests/${id}/confirm`, {
      electronicSignature: signature,
      comment: comment.trim(),
    });

    return response.data.data;
  },

  /*
   * Le membre dépose la preuve de paiement de la cotation.
   * Le backend transmet ensuite le dossier au Programme avec
   * le statut program_payment_review.
   */
  async uploadPaymentProof(
    id: number,
    document: File
  ): Promise<SpaceRequest> {
    validateRequestId(id);
    requireDocument(document);

    const formData = new FormData();

    formData.append(
      "document",
      document,
      document.name
    );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >(
      `/space-requests/${id}/payment-proof`,
      formData
    );

    return response.data.data;
  },

  /*
   * Validation signée d’un service.
   */
  async validate(
    id: number,
    comment: string,
    electronicSignature: string
  ): Promise<SpaceRequest> {
    validateRequestId(id);

    const signature =
      requireSignature(
        electronicSignature
      );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >(`/space-requests/${id}/validate`, {
      comment: comment.trim(),
      electronicSignature: signature,
    });

    return response.data.data;
  },

  /*
   * Rejet signé d’un service.
   */
  async reject(
    id: number,
    comment: string,
    electronicSignature: string
  ): Promise<SpaceRequest> {
    validateRequestId(id);

    const cleanComment =
      comment.trim();

    if (cleanComment.length < 5) {
      throw new Error(
        "Le motif du rejet doit contenir au moins 5 caractères."
      );
    }

    const signature =
      requireSignature(
        electronicSignature
      );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >(`/space-requests/${id}/reject`, {
      comment: cleanComment,
      electronicSignature: signature,
    });

    return response.data.data;
  },

  /*
   * Validation financière.
   *
   * Le document FINANCE_QUOTE doit avoir
   * été ajouté avant cet appel.
   */
  async validateFinance(
    id: number,
    paymentAmount: number,
    comment: string,
    electronicSignature: string
  ): Promise<SpaceRequest> {
    validateRequestId(id);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount < 0
    ) {
      throw new Error(
        "Le montant de la cotation est invalide."
      );
    }

    const signature =
      requireSignature(
        electronicSignature
      );

    const response = await api.post<
      ApiResponse<SpaceRequest>
    >(`/space-requests/${id}/validate`, {
      paymentAmount,
      comment: comment.trim(),
      electronicSignature: signature,
    });

    return response.data.data;
  },
};