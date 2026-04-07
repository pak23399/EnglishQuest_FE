import {
  HeartStatus,
  LeaderboardEntry,
  LeaderboardPeriod,
  MyRank,
  PaginatedLeaderboard,
  PaginationRequest,
  StreakInfo,
} from '@/models/gamification.model';
import apiClient from '@/lib/api-client';

export const gamificationService = {
  // ==================== Hearts ====================
  /**
   * Get current heart (lives) status
   */
  async getHeartStatus(): Promise<HeartStatus> {
    const response = await apiClient.get('/heart/status');
    return response.data;
  },

  /**
   * Restore one heart by watching an advertisement
   */
  async restoreHeartByAd(): Promise<{ status: boolean }> {
    const response = await apiClient.post('/heart/restore-ad');
    return response.data;
  },

  // ==================== Streak ====================
  /**
   * Get current streak information
   */
  async getStreakInfo(): Promise<StreakInfo> {
    const response = await apiClient.get('/streak/info');
    return response.data;
  },

  /**
   * Use a streak freeze (Premium feature)
   */
  async freezeStreak(): Promise<{ status: boolean }> {
    const response = await apiClient.post('/streak/freeze');
    return response.data;
  },

  // ==================== Leaderboard ====================
  /**
   * Get global leaderboard (all-time)
   */
  async getGlobalLeaderboard(
    pagination: PaginationRequest,
  ): Promise<PaginatedLeaderboard> {
    const response = await apiClient.post('/leaderboard/global', pagination);
    return response.data;
  },

  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(
    pagination: PaginationRequest,
  ): Promise<PaginatedLeaderboard> {
    const response = await apiClient.post('/leaderboard/weekly', pagination);
    return response.data;
  },

  /**
   * Get monthly leaderboard
   */
  async getMonthlyLeaderboard(
    pagination: PaginationRequest,
  ): Promise<PaginatedLeaderboard> {
    const response = await apiClient.post('/leaderboard/monthly', pagination);
    return response.data;
  },

  /**
   * Get current user's rank across all periods
   */
  async getMyRank(): Promise<MyRank> {
    const response = await apiClient.get('/leaderboard/my-rank');
    return response.data;
  },

  /**
   * Get leaderboard rankings around the current user
   */
  async getRankingsAroundMe(
    periodType: LeaderboardPeriod = LeaderboardPeriod.Weekly,
    range: number = 5,
  ): Promise<LeaderboardEntry[]> {
    const response = await apiClient.get('/leaderboard/around-me', {
      params: { periodType, range },
    });
    return response.data;
  },
};
