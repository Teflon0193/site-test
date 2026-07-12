import api from "@/lib/api";
import type {
  ApiResponse,
  Space,
} from "@/types/space-request";

export const spaceService = {
  async getAll(): Promise<Space[]> {
    const response = await api.get<
      ApiResponse<Space[]>
    >("/spaces");

    return response.data.data;
  },
};