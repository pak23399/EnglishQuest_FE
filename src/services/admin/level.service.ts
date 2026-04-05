import { Level } from '@/models/content.model';
import apiClient from '@/lib/api-client';
import { PagedRequest, PagedResponse } from './section.service';

export interface CreateLevelRequest {
  sectionId: string;
  title: string;
  description: string;
  order: number;
  difficulty: number;
  prerequisiteIds: string[];
  estimatedMinutes: number;
  passingScore: number;
  totalQuestions: number;
  xpReward: number;
  isRandomized: boolean;
}

export interface UpdateLevelRequest {
  id: string;
  title?: string;
  description?: string;
  order?: number;
  difficulty?: number;
  prerequisiteIds?: string[];
  passingScore?: number;
  totalQuestions?: number;
  xpReward?: number;
  estimatedMinutes?: number;
  isRandomized?: boolean;
}

export const adminLevelService = {
  /**
   * Create a new level (Admin only)
   */
  async createLevel(data: CreateLevelRequest): Promise<Level> {
    const response = await apiClient.post('/level', data);
    return response.data;
  },

  /**
   * Update an existing level (Admin only)
   */
  async updateLevel(data: UpdateLevelRequest): Promise<Level> {
    const response = await apiClient.put('/level', data);
    return response.data;
  },

  /**
   * Delete a level (Admin only)
   */
  async deleteLevel(id: string): Promise<{ status: boolean }> {
    const response = await apiClient.delete(`/level/${id}`);
    return response.data;
  },

  /**
   * Get paginated levels (Admin only)
   */
  async getLevelsPaged(request: PagedRequest): Promise<PagedResponse<Level>> {
    const response = await apiClient.post('/level/paged', request);
    return response.data;
  },

  /**
   * Get levels by section (Admin only)
   */
  async getLevelsBySection(sectionId: string): Promise<Level[]> {
    const response = await apiClient.get(`/level/section/${sectionId}`);
    return response.data;
  },

  /**
   * Get level by ID (Admin only)
   */
  async getLevelById(id: string): Promise<Level> {
    const response = await apiClient.get(`/level/${id}`);
    return response.data;
  },

  /**
   * Reorder levels (Admin only)
   */
  async reorderLevels(levelIds: string[]): Promise<{ status: boolean }> {
    const response = await apiClient.post('/level/reorder', levelIds);
    return response.data;
  },
};
