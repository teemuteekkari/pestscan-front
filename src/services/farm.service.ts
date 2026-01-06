// src/services/farm.service.ts
import { axiosInstance } from './api.client';
import {
  FarmResponse,
  CreateFarmRequest,
  UpdateFarmRequest,
  GreenhouseDto,
  CreateGreenhouseRequest,
  FieldBlockDto,
  CreateFieldBlockRequest,
} from '../types/api.types';

class FarmService {
  // Farm endpoints
  async getFarms(): Promise<FarmResponse[]> {
    const response = await axiosInstance.get<FarmResponse[]>('/farms');
    return response.data;
  }

  async getFarm(farmId: string): Promise<FarmResponse> {
    const response = await axiosInstance.get<FarmResponse>(`/farms/${farmId}`); // ✅ Fixed
    return response.data;
  }

  async createFarm(data: CreateFarmRequest): Promise<FarmResponse> {
    const response = await axiosInstance.post<FarmResponse>('/farms', data);
    return response.data;
  }

  async updateFarm(farmId: string, data: UpdateFarmRequest): Promise<FarmResponse> {
    const response = await axiosInstance.put<FarmResponse>(`/farms/${farmId}`, data); // ✅ Fixed
    return response.data;
  }

  // Greenhouse endpoints
  async getGreenhouses(farmId: string): Promise<GreenhouseDto[]> {
    const response = await axiosInstance.get<GreenhouseDto[]>(`/farms/${farmId}/greenhouses`); // ✅ Fixed
    return response.data;
  }

  async createGreenhouse(farmId: string, data: CreateGreenhouseRequest): Promise<GreenhouseDto> {
    const response = await axiosInstance.post<GreenhouseDto>(
      `/farms/${farmId}/greenhouses`,
      data
    );
    return response.data;
  }

  async updateGreenhouse(
    greenhouseId: string,
    data: Partial<CreateGreenhouseRequest>
  ): Promise<GreenhouseDto> {
    const response = await axiosInstance.put<GreenhouseDto>(
      `/greenhouses/${greenhouseId}`,
      data
    );
    return response.data;
  }

  async deleteGreenhouse(greenhouseId: string): Promise<void> {
    await axiosInstance.delete(`/greenhouses/${greenhouseId}`); // ✅ Fixed
  }

  // Field Block endpoints
  async getFieldBlocks(farmId: string): Promise<FieldBlockDto[]> {
    const response = await axiosInstance.get<FieldBlockDto[]>(`/farms/${farmId}/field-blocks`); // ✅ Fixed
    return response.data;
  }

  async createFieldBlock(farmId: string, data: CreateFieldBlockRequest): Promise<FieldBlockDto> {
    const response = await axiosInstance.post<FieldBlockDto>(
      `/farms/${farmId}/field-blocks`,
      data
    );
    return response.data;
  }

  async updateFieldBlock(
    fieldBlockId: string,
    data: Partial<CreateFieldBlockRequest>
  ): Promise<FieldBlockDto> {
    const response = await axiosInstance.put<FieldBlockDto>(
      `/field-blocks/${fieldBlockId}`,
      data
    );
    return response.data;
  }

  async deleteFieldBlock(fieldBlockId: string): Promise<void> {
    await axiosInstance.delete(`/field-blocks/${fieldBlockId}`); // ✅ Fixed
  }
}

export const farmService = new FarmService();