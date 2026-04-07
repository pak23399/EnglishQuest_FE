import { LeaderboardTable } from '@/components/gamification';

export function LeaderboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          Compete with learners worldwide
        </p>
      </div>


      {/* Leaderboard Table */}
      <LeaderboardTable />
    </div>
  );
}
