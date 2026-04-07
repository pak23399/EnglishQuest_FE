import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLeaderboard, useMyRank } from '@/hooks/use-leaderboard';
import { LeaderboardPeriod } from '@/models/gamification.model';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  className?: string;
}

export function LeaderboardTable({ className }: LeaderboardTableProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>(LeaderboardPeriod.Weekly);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { data: leaderboardData, isLoading } = useLeaderboard(period, {
    pageNumber: currentPage,
    pageSize,
  });

  const { data: myRank } = useMyRank();

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) return { icon: TrendingUp, color: 'text-green-500', text: `+${change}` };
    if (change < 0) return { icon: TrendingDown, color: 'text-red-500', text: `${change}` };
    return { icon: Minus, color: 'text-gray-400', text: '0' };
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-yellow-950';
    if (rank === 2) return 'bg-gray-400 text-gray-950';
    if (rank === 3) return 'bg-amber-600 text-amber-950';
    return 'bg-primary/10 text-primary';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>

          {myRank && (
            <div className="text-sm text-muted-foreground">
              Your Rank: <span className="font-semibold text-foreground">
                #{period === LeaderboardPeriod.Global ? myRank.globalRank :
                  period === LeaderboardPeriod.Weekly ? myRank.weeklyRank :
                    myRank.monthlyRank}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={LeaderboardPeriod.Weekly}>Weekly</TabsTrigger>
            <TabsTrigger value={LeaderboardPeriod.Monthly}>Monthly</TabsTrigger>
            <TabsTrigger value={LeaderboardPeriod.Global}>All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="mt-4">
            {leaderboardData && leaderboardData.items && leaderboardData.items.length > 0 ? (
              <div className="space-y-2">
                {leaderboardData.items.map((entry) => {
                  const rankChange = getRankChange(entry.rank, entry.previousRank ?? entry.rank);
                  const RankChangeIcon = rankChange.icon;

                  return (
                    <div
                      key={entry.userId}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                        entry.isCurrentUser
                          ? 'bg-primary/5 border-primary'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12">
                        <Badge
                          className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold',
                            getRankBadgeColor(entry.rank)
                          )}
                        >
                          {entry.rank}
                        </Badge>
                      </div>

                      {/* Avatar & Info */}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.avatar ?? undefined} alt={entry.userName} />
                        <AvatarFallback>
                          {entry.userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">
                            {entry.userName}
                          </p>
                          {entry.isCurrentUser && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{entry.totalXp.toLocaleString()} XP</span>
                          <span>•</span>
                          <span>{entry.completedLevels} levels</span>
                          <span>•</span>
                          <span>{entry.averageAccuracy.toFixed(1)}% acc</span>
                        </div>
                      </div>

                      {/* Rank Change */}
                      <div className={cn('flex items-center gap-1', rankChange.color)}>
                        <RankChangeIcon className="h-4 w-4" />
                        <span className="text-xs font-medium">{rankChange.text}</span>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {entry.rankingScore.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">score</p>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {leaderboardData?.meta && leaderboardData.meta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={leaderboardData.meta.currentPage <= 1}
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {leaderboardData.meta.currentPage} of {leaderboardData.meta.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={leaderboardData.meta.currentPage >= leaderboardData.meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No leaderboard data available yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
