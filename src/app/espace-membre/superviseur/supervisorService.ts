import api from "@/lib/api";
import type { SpaceRequest } from "@/services/spaceRequestService";

export const ASSIGNABLE_ROLES = [
  "MEMBER",
  "PROGRAMME",
  "REGISSEUR_GENERAL",
  "DIRECTION_ARTISTIQUE",
  "COMMUNICATION",
  "JURIDIQUE",
  "FINANCE",
  "SUPERVISEUR",
  "ADMIN",
] as const;

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export interface SupervisedUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  role: string;
  email_verified: number | boolean;
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const supervisorService = {
  async getOverview(): Promise<SpaceRequest[]> {
    const response = await api.get<ApiResponse<SpaceRequest[]>>(
      "/space-requests/supervisor"
    );
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getUsers(): Promise<SupervisedUser[]> {
    const response = await api.get<ApiResponse<SupervisedUser[]>>(
      "/auth/supervisor/users"
    );
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async assignRole(id: number, role: AssignableRole): Promise<SupervisedUser> {
    const response = await api.put<ApiResponse<SupervisedUser>>(
      `/auth/supervisor/users/${id}/role`,
      { role }
    );
    return response.data.data;
  },

  async resetPassword(id: number, newPassword: string): Promise<void> {
    await api.put(`/auth/supervisor/users/${id}/reset-password`, {
      new_password: newPassword,
    });
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/auth/supervisor/users/${id}`);
  },
};