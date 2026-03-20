import { useAuth } from '@/auth/context/auth-context';
import { NotificationsSheet } from '@/layouts/main-layout/components/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/layouts/main-layout/components/topbar/user-dropdown-menu';
import { Bell } from 'lucide-react';
import { getAvatarFallback } from '@/lib/string/avatar-fallback';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeContainer, Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HeartsDisplay, StreakTracker } from '@/components/gamification';
import { SubscriptionPlan } from '@/models/user.model';
import { useIntl } from 'react-intl';
import { useActiveSubscription } from '@/hooks/use-subscription';

const HeaderTopbar = () => {
  const { user } = useAuth();
  const intl = useIntl();
  const { data: subscription } = useActiveSubscription();

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
    <div className="flex items-center gap-5">
      {/* Streak Tracker */}
      <div className="hidden lg:block">
        <StreakTracker variant="compact" />
      </div>

      {/* Hearts Display */}
      <div className="hidden lg:block">
        <HeartsDisplay size="sm" />
      </div>

      {/* Vertical Separator */}
      <div className="hidden lg:block h-6 w-px bg-border" />

      <Badge
        variant="primary"
        appearance="light"
        className="h-fit max-h-fit py-1.5 text-center"
      >
        {getPlanName()}
      </Badge>

      <NotificationsSheet
        trigger={
          <BadgeContainer>
            <Button
              variant="ghost"
              mode="icon"
              shape="circle"
              className="hover:bg-primary/10 hover:[&_svg]:text-primary"
            >
              <Bell className="!size-4.5" />
            </Button>
            {/* TODO: Add notification count */}
          </BadgeContainer>
        }
      />
      <UserDropdownMenu
        trigger={
          <Avatar className="size-9 rounded-full border-2 border-green-500">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>
              {getAvatarFallback(user?.username ?? '')}
            </AvatarFallback>
          </Avatar>
        }
      />
    </div>
  );
};

export { HeaderTopbar };
