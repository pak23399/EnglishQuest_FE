import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ENGLISHQUEST_MENU_SIDEBAR, ADMIN_MENU_ITEMS } from '@/layouts/main-layout/menus/englishquest-menu.config';
import { useAuth } from '@/auth/context/auth-context';
import { UserRole } from '@/models/user.model';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { useIntl } from 'react-intl';

export function MegaMenu() {
  const intl = useIntl();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Combine base menu with admin menu items if user is admin
  const menuConfig = useMemo(() => {
    if (user?.role === UserRole.Admin) {
      return [...ENGLISHQUEST_MENU_SIDEBAR, ...ADMIN_MENU_ITEMS];
    }
    return ENGLISHQUEST_MENU_SIDEBAR;
  }, [user?.role]);

  // Filter out heading items
  const menuItems = menuConfig.filter(item => !item.heading);

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || (path !== '/' && pathname.startsWith(path));
  };

  const hasActiveChild = (children?: typeof menuItems) => {
    if (!children) return false;
    return children.some(child => isActive(child.path));
  };

  const linkClass = `
    text-sm text-secondary-foreground font-medium rounded-none px-0 border-b border-transparent
    hover:text-primary hover:bg-transparent 
    focus:text-primary focus:bg-transparent 
    data-[active=true]:text-primary data-[active=true]:bg-transparent data-[active=true]:border-primary
    data-[state=open]:text-primary data-[state=open]:bg-transparent
  `;

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-6">
        {menuItems.map((item) => {
          const title = item.title ? intl.formatMessage({ id: item.title }) : '';
          // Use unique key based on path or title
          const uniqueKey = item.path || item.title || Math.random().toString();

          // If item has children, render as dropdown
          if (item.children && item.children.length > 0) {
            return (
              <NavigationMenuItem key={uniqueKey}>
                <NavigationMenuTrigger
                  className={cn(linkClass)}
                  data-active={hasActiveChild(item.children) || undefined}
                >
                  {title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-1 p-2">
                    {item.children.map((child, childIndex) => {
                      const childTitle = child.title ? intl.formatMessage({ id: child.title }) : '';
                      return (
                      <li key={child.path || childIndex}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={child.path || '#'}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              isActive(child.path) && 'bg-accent text-accent-foreground font-medium'
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {childTitle}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          // Regular link item
          return (
            <NavigationMenuItem key={uniqueKey}>
              <NavigationMenuLink asChild>
                <Link
                  to={item.path || '/'}
                  className={cn(linkClass)}
                  data-active={isActive(item.path) || undefined}
                >
                  {title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
