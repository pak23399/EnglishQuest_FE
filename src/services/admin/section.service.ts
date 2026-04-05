import { Section } from '@/models/content.model';
import apiClient from '@/lib/api-client';

export interface CreateSectionRequest {
  title: string;
  description: string;
  order: number;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isFreeAccess: boolean;
  requiredPlan: number;
  prerequisiteIds: string[];
  estimatedMinutes: number;
}

export interface UpdateSectionRequest {
  id: string;
  title?: string;
  description?: string;
  order?: number;
  imageUrl?: string | null;
  iconUrl?: string | null;
  isFreeAccess?: boolean;
  requiredPlan?: number;
  prerequisiteIds?: string[];
  estimatedMinutes?: number;
}

export interface PagedRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PagedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const adminSectionService = {
  /**
   * Create a new section (Admin only)
   */
  async createSection(data: CreateSectionRequest): Promise<Section> {
    const response = await apiClient.post('/section', data);
    return response.data;
  },

  /**
   * Update an existing section (Admin only)
   */
  async updateSection(data: UpdateSectionRequest): Promise<Section> {
    const response = await apiClient.put('/section', data);
    return response.data;
  },

  /**
   * Delete a section (Admin only)
   */
  async deleteSection(id: string): Promise<{ status: boolean }> {
    const response = await apiClient.delete(`/section/${id}`);
    return response.data;
  },

  /**
   * Get paginated sections (Admin only)
   */
  async getSectionsPaged(
    request: PagedRequest,
  ): Promise<PagedResponse<Section>> {
    const response = await apiClient.post('/section/paged', request);
    return response.data;
  },

  /**
   * Reorder sections (Admin only)
   */
  async reorderSections(sectionIds: string[]): Promise<{ status: boolean }> {
    const response = await apiClient.post('/section/reorder', sectionIds);
    return response.data;
  },

  /**
   * Get all sections (Public)
   */
  async getAllSections(): Promise<Section[]> {
    const response = await apiClient.get('/section/all');
    // API returns object with numeric keys, convert to array
    const data = response.data;
    if (Array.isArray(data)) {
      return data.map((section) => ({
        ...section,
        totalLevels: section.metadata?.TotalLevels || 0,
      }));
    }
    // Convert object with numeric keys to array
    return (Object.values(data) as Section[]).map((section) => ({
      ...section,
      totalLevels: section.metadata?.TotalLevels || 0,
    }));
  },
};
