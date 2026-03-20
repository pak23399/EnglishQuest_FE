import { ReactNode } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { ROUTE_PATHS } from '@/routing/paths';
import { User, Settings, LogOut, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { XPProgress } from '@/components/gamification';
import { useLanguage } from '@/providers/i18n-context';
import { I18N_LANGUAGES } from '@/i18n/config';

import { useIntl } from 'react-intl';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { logout, user } = useAuth();
  const { changeLanguage, currenLanguage } = useLanguage();
  const intl = useIntl();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex flex-col p-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <Link
                to={ROUTE_PATHS.PROFILE}
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                {user?.username}
              </Link>
              <a
                href={`mailto:${user?.email}`}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                {user?.email}
              </a>
            </div>
          </div>
          {/* XP Progress Card */}
          <div className="mt-2">
            <XPProgress showLevel={true} />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link
            to={ROUTE_PATHS.PROFILE}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            {intl.formatMessage({ id: 'USER.MENU.MY_PROFILE' })}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to={ROUTE_PATHS.SUBSCRIPTION}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            {intl.formatMessage({ id: 'USER.MENU.BILLING' })}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="h-4 w-4" />
            {intl.formatMessage({ id: 'USER.MENU.LANGUAGE' })}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {I18N_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang)}
                className="justify-between"
              >
                <span className="flex items-center gap-2">
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  {lang.label}
                </span>
                {currenLanguage.code === lang.code && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            {intl.formatMessage({ id: 'USER.MENU.LOGOUT' })}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
