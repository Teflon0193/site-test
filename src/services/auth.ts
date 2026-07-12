import api from "@/lib/api";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
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

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    {
      email: email.trim().toLowerCase(),
      password,
    }
  );

  const data = response.data;

  if (!data.success) {
    throw new Error(
      data.message || "Échec de la connexion"
    );
  }

  if (!data.token) {
    throw new Error(
      "Le serveur n'a pas retourné de token"
    );
  }

  if (!data.user) {
    throw new Error(
      "Le serveur n'a pas retourné l'utilisateur"
    );
  }

  return data;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<ProfileResponse>(
    "/auth/profile"
  );

  if (!response.data.success || !response.data.user) {
    throw new Error(
      "Impossible de récupérer le profil utilisateur"
    );
  }

  return response.data.user;
}

export async function register(
  data: RegisterData
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone: data.phone?.trim() || null,
    }
  );

  return response.data;
}