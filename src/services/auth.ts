import api from "@/lib/api";

export type UserRole =
  | "MEMBER"
  | "ADMIN"
  | "PROGRAMME"
  | "REGISSEUR_GENERAL"
  | "DIRECTION_ARTISTIQUE"
  | "COMMUNICATION"
  | "JURIDIQUE"
  | "FINANCE";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  role: UserRole | string;
  email_verified: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailResponse
  extends MessageResponse {
  user?: User;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      {
        email: normalizeEmail(email),
        password,
      }
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Échec de la connexion"
    );
  }

  if (!response.data.token) {
    throw new Error(
      "Le serveur n'a pas retourné de token"
    );
  }

  if (!response.data.user) {
    throw new Error(
      "Le serveur n'a pas retourné l'utilisateur"
    );
  }

  return response.data;
}

export async function register(
  data: RegisterData
): Promise<RegisterResponse> {
  const response =
    await api.post<RegisterResponse>(
      "/auth/register",
      {
        email: normalizeEmail(data.email),
        password: data.password,
        first_name:
          data.first_name.trim(),
        last_name:
          data.last_name.trim(),
        phone:
          data.phone?.trim() || null,
      }
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Impossible de créer le compte"
    );
  }

  return response.data;
}

export async function forgotPassword(
  email: string
): Promise<MessageResponse> {
  const response =
    await api.post<MessageResponse>(
      "/auth/forgot",
      {
        email: normalizeEmail(email),
      }
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Impossible d'envoyer le lien de réinitialisation"
    );
  }

  return response.data;
}

export async function resetPassword(
  token: string,
  password: string
): Promise<MessageResponse> {
  if (!token?.trim()) {
    throw new Error(
      "Le token de réinitialisation est absent"
    );
  }

  if (!password) {
    throw new Error(
      "Le nouveau mot de passe est obligatoire"
    );
  }

  const response =
    await api.post<MessageResponse>(
      "/auth/reset",
      {
        token: token.trim(),
        password,
      }
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Impossible de réinitialiser le mot de passe"
    );
  }

  return response.data;
}

export async function verifyEmail(
  token: string
): Promise<VerifyEmailResponse> {
  if (!token?.trim()) {
    throw new Error(
      "Le token de vérification est absent"
    );
  }

  const response =
    await api.get<VerifyEmailResponse>(
      "/auth/verify-email",
      {
        params: {
          token: token.trim(),
        },
      }
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Impossible de vérifier l'adresse email"
    );
  }

  return response.data;
}

export async function resendVerification(
  email: string
): Promise<MessageResponse> {
  const response =
    await api.post<MessageResponse>(
      "/auth/resend-verification",
      {
        email: normalizeEmail(email),
      }
    );

  if (!response.data.success) {
    throw new Error(
      response.data.message ||
        "Impossible de renvoyer l'email de vérification"
    );
  }

  return response.data;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<{
    success?: boolean;
    user?: User;
    data?: User;
  }>("/auth/profile");

  const user =
    response.data.user ??
    response.data.data;

  if (!user) {
    throw new Error(
      "Le serveur n'a pas retourné le profil"
    );
  }

  return user;
}

export async function updateProfile(
  data: Partial<User>
): Promise<User> {
  const response = await api.put<{
    success?: boolean;
    user?: User;
    data?: User;
  }>("/auth/profile", data);

  const user =
    response.data.user ??
    response.data.data;

  if (!user) {
    throw new Error(
      "Le serveur n'a pas retourné le profil mis à jour"
    );
  }

  return user;
}