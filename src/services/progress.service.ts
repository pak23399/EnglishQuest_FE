import {
  SectionProgress,
  SectionSummary,
  UserProgress,
} from '@/models/progress.model';
import apiClient from '@/lib/api-client';

export const progressService = {
  /**
   * Get user's progress for a specific level
   */
  async getLevelProgress(levelId: string): Promise<UserProgress> {
    const response = await apiClient.get(`/progress/level/${levelId}`);
    return response.data;
  },

  /**
   * Get progress for all levels in a section
   */
  async getSectionProgress(sectionId: string): Promise<SectionProgress[]> {
    const response = await apiClient.get(`/progress/section/${sectionId}`);
    return response.data;
  },

  /**
   * Get progress for all levels
   */
  async getAllProgress(): Promise<UserProgress[]> {
    const response = await apiClient.get('/progress/all');
    return response.data;
  },

  /**
   * Get summary statistics for a section
   */
  async getSectionSummary(sectionId: string): Promise<SectionSummary> {
    const response = await apiClient.get(
      `/progress/section/${sectionId}/summary`,
    );
    return response.data;
  },

  /**
   * Get user's total experience points
   */
  async getTotalXP(): Promise<number> {
    const response = await apiClient.get('/progress/stats/xp');
    return response.data;
  },

  /**
   * Get number of completed levels
   */
  async getCompletedLevelsCount(): Promise<number> {
    const response = await apiClient.get('/progress/stats/completed-levels');
    return response.data;
  },
};
