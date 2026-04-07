import { Mail, Award } from 'lucide-react';
import { useAuth } from '@/auth/context/auth-context';
import { XPProgress, StreakTracker, HeartsDisplay } from '@/components/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTotalXP, useCompletedLevelsCount } from '@/hooks/use-progress';
import { useStreakInfo } from '@/hooks/use-streak';
import { useMyRank } from '@/hooks/use-leaderboard';
import { getAvatarFallback } from '@/lib/string/avatar-fallback';
import { useActiveSubscription } from '@/hooks/use-subscription';
import { SubscriptionPlan } from '@/models/user.model';
import { useIntl } from 'react-intl';

export function ProfilePage() {
  const intl = useIntl();
  const { user } = useAuth();
  const { data: subscription } = useActiveSubscription();
  const { data: totalXP } = useTotalXP();
  const { data: completedLevels } = useCompletedLevelsCount();
  const { data: streakInfo } = useStreakInfo();
  const { data: myRank } = useMyRank();

  const getPlanName = () => {
    const plan = subscription?.plan ?? user?.currentPlan ?? SubscriptionPlan.Free;
    switch (plan) {
      case SubscriptionPlan.Free:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_FREE' });
      case SubscriptionPlan.Support:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_SUPPORT' });
      case SubscriptionPlan.Premium:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_PREMIUM' });
      default:
        return intl.formatMessage({ id: 'SUBSCRIPTION.PLAN_FREE' });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View your progress and achievements
        </p>
      </div>

      {/* Profile Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-2xl">
                {getAvatarFallback(user?.username ?? '')}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="primary" appearance="light">
                  {getPlanName()}
                </Badge>
                {user?.role === 1 && (
                  <Badge variant="secondary">
                    <Award className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {totalXP?.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {completedLevels || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              #{myRank?.globalRank || '---'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Lives</CardTitle>
          </CardHeader>
          <CardContent>
            <HeartsDisplay />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakTracker variant="detailed" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Level Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <XPProgress showLevel />
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Achievements coming !soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
