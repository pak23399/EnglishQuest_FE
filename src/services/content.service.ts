import {
  Level,
  LevelAccessStatus,
  LevelUnlockProgress,
  Section,
  SectionWithLevels,
} from '@/models/content.model';
import apiClient from '@/lib/api-client';

export const contentService = {
  // ==================== Sections ====================
  /**
   * Get all sections
   */
  async getAllSections(): Promise<Section[]> {
    const response = await apiClient.get('/section/all');
    return response.data;
  },

  /**
   * Get section by ID
   */
  async getSection(sectionId: string): Promise<Section | null> {
    const response = await apiClient.get(`/section/${sectionId}`);
    return response.data;
  },

  /**
   * Get section with its levels
   */
  async getSectionWithLevels(sectionId: string): Promise<SectionWithLevels> {
    const response = await apiClient.get(`/section/${sectionId}/levels`);
    return response.data;
  },

  // ==================== Levels ====================
  /**
   * Get level by ID
   */
  async getLevel(levelId: string): Promise<Level | null> {
    const response = await apiClient.get(`/level/${levelId}`);
    return response.data;
  },

  /**
   * Get levels by section
   */
  async getLevelsBySection(sectionId: string): Promise<Level[]> {
    const response = await apiClient.get(`/level/section/${sectionId}`);
    return response.data;
  },

  // ==================== Access Control ====================
  /**
   * Check if user can access a specific level
   */
  async checkLevelAccess(levelId: string): Promise<boolean> {
    const response = await apiClient.get(
      `/access-control/level/${levelId}/check`,
    );
    return response.data;
  },

  /**
   * Get detailed access status for a level
   */
  async getLevelAccessStatus(levelId: string): Promise<LevelAccessStatus> {
    const response = await apiClient.get(
      `/access-control/level/${levelId}/status`,
    );
    return response.data;
  },

  /**
   * Check if user can access a specific section
   */
  async checkSectionAccess(sectionId: string): Promise<boolean> {
    const response = await apiClient.get(
      `/access-control/section/${sectionId}/check`,
    );
    return response.data;
  },

  /**
   * Check if user can access a specific feature
   */
  async checkFeatureAccess(featureName: string): Promise<boolean> {
    const response = await apiClient.get(
      `/access-control/feature/${featureName}/check`,
    );
    return response.data;
  },

  // ==================== Unlocking ====================
  /**
   * Get all sections user can access based on subscription
   */
  async getAvailableSections(): Promise<Section[]> {
    const response = await apiClient.get('/unlocking/sections/available');
    return response.data;
  },

  /**
   * Get all unlocked levels for a section
   */
  async getUnlockedLevels(sectionId: string): Promise<Level[]> {
    const response = await apiClient.get(
      `/unlocking/section/${sectionId}/levels/unlocked`,
    );
    return response.data;
  },

  /**
   * Get progress toward unlocking a specific level
   */
  async getLevelUnlockProgress(levelId: string): Promise<LevelUnlockProgress> {
    const response = await apiClient.get(
      `/unlocking/level/${levelId}/progress`,
    );
    return response.data;
  },

  /**
   * Unlock next level after completing current level
   */
  async unlockNextLevel(currentLevelId: string): Promise<{ status: boolean }> {
    const response = await apiClient.post(
      `/unlocking/level/${currentLevelId}/unlock-next`,
    );
    return response.data;
  },

  /**
   * Unlock an entire section
   */
  async unlockSection(sectionId: string): Promise<{ status: boolean }> {
    const response = await apiClient.post(
      `/unlocking/section/${sectionId}/unlock`,
    );
    return response.data;
  },
};
