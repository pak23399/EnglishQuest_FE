'use client';

import { JSX, useCallback, useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ENGLISHQUEST_MENU_SIDEBAR, ADMIN_MENU_ITEMS } from '@/layouts/main-layout/menus/englishquest-menu.config';
import { useAuth } from '@/auth/context/auth-context';
import { UserRole } from '@/models/user.model';
import { cn } from '@/lib/utils';
import {
  AccordionMenu,
  AccordionMenuClassNames,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/components/ui/accordion-menu';
import { Badge } from '@/components/ui/badge';

export interface MenuItem {
  title?: string;
  icon?: LucideIcon;
  path?: string;
  rootPath?: string;
  childrenIndex?: number;
  heading?: string;
  children?: MenuItem[];
  disabled?: boolean;
  collapse?: boolean;
  collapseTitle?: string;
  expandTitle?: string;
  badge?: string;
  separator?: boolean;
}

export type MenuConfig = MenuItem[];

import { useIntl } from 'react-intl';

export function MegaMenuMobile() {
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

  // Memoize matchPath to prevent unnecessary re-renders
  const matchPath = useCallback(
    (path: string): boolean =>
      path === pathname || (path.length > 1 && pathname.startsWith(path)),
    [pathname],
  );

  // Global classNames for consistent styling
  const classNames: AccordionMenuClassNames = {
    root: 'space-y-1',
    group: 'gap-px',
    label:
      'uppercase text-xs font-medium text-muted-foreground/70 pt-2.25 pb-px',
    separator: '',
    item: 'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium',
    sub: '',
    subTrigger:
      'h-8 hover:bg-transparent text-accent-foreground hover:text-primary data-[selected=true]:text-primary data-[selected=true]:bg-muted data-[selected=true]:font-medium',
    subContent: 'py-0',
    indicator: '',
  };

  const buildMenu = (items: MenuConfig): JSX.Element[] => {
    return items.map((item: MenuItem, index: number) => {
      if (item.heading) {
        return buildMenuHeading(item, index);
      } else if (!item.disabled) {
        return buildMenuItemRoot(item, index);
      } else {
        return <></>;
      }
    });
  };

  const buildMenuItemRoot = (item: MenuItem, index: number): JSX.Element => {
    const title = item.title ? intl.formatMessage({ id: item.title }) : '';
    if (item.children) {
      return (
        <AccordionMenuSub key={index} value={item.path || `root-${index}`}>
          <AccordionMenuSubTrigger className="text-sm font-medium">
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <div className="flex items-center justify-between grow gap-2">
              <span data-slot="accordion-menu-title">{title}</span>
              {item.badge && (
                <Badge variant="secondary" size="sm" className="ms-auto">
                  {item.badge}
                </Badge>
              )}
            </div>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `root-${index}`}
            className="ps-6"
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(item.children, 1)}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    } else {
      return (
        <AccordionMenuItem
          key={index}
          value={item.path || ''}
          className="text-sm font-medium"
        >
          <Link to={item.path || '#'} className="">
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <div className="flex items-center justify-between grow gap-2">
              <span data-slot="accordion-menu-title">{title}</span>
              {item.badge && (
                <Badge variant="secondary" size="sm" className="ms-auto">
                  {item.badge}
                </Badge>
              )}
            </div>
          </Link>
        </AccordionMenuItem>
      );
    }
  };

  const buildMenuItemChildren = (
    items: MenuConfig,
    level: number = 0,
  ): JSX.Element[] => {
    return items.map((item: MenuItem, index: number) => {
      if (!item.disabled) {
        return buildMenuItemChild(item, index, level);
      } else {
        return <></>;
      }
    });
  };

  const buildMenuItemChild = (
    item: MenuItem,
    index: number,
    level: number = 0,
  ): JSX.Element => {
    const title = item.title ? intl.formatMessage({ id: item.title }) : '';
    if (item.children) {
      return (
        <AccordionMenuSub
          key={index}
          value={item.path || `child-${level}-${index}`}
        >
          <AccordionMenuSubTrigger className="text-[13px]">
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            {item.collapse ? (
              <span className="text-muted-foreground">
                <span className="hidden [[data-state=open]>span>&]:inline">
                  {item.collapseTitle}
                </span>
                <span className="inline [[data-state=open]>span>&]:hidden">
                  {item.expandTitle}
                </span>
              </span>
            ) : (
              title
            )}
            {item.badge && (
              <Badge variant="secondary" size="sm" className="ms-auto">
                {item.badge}
              </Badge>
            )}
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            type="single"
            collapsible
            parentValue={item.path || `child-${level}-${index}`}
            className={cn('ps-4', !item.collapse && 'relative')}
          >
            <AccordionMenuGroup>
              {buildMenuItemChildren(
                item.children,
                item.collapse ? level : level + 1,
              )}
            </AccordionMenuGroup>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      );
    } else {
      return (
        <AccordionMenuItem
          key={index}
          value={item.path || ''}
          className="text-[13px]"
        >
          <Link to={item.path || '#'}>
            {item.icon && <item.icon data-slot="accordion-menu-icon" />}
            <div className="flex items-center justify-between grow gap-2">
              <span>{title}</span>
              {item.badge && (
                <Badge variant="secondary" size="sm" className="ms-auto">
                  {item.badge}
                </Badge>
              )}
            </div>
          </Link>
        </AccordionMenuItem>
      );
    }
  };

  const buildMenuHeading = (item: MenuItem, index: number): JSX.Element => {
    const heading = item.heading ? intl.formatMessage({ id: item.heading }) : '';
    return <AccordionMenuLabel key={index}>{heading}</AccordionMenuLabel>;
  };

  return (
    <div className="flex grow shrink-0 py-5 px-5">
      <AccordionMenu
        selectedValue={pathname}
        matchPath={matchPath}
        type="single"
        collapsible
        classNames={classNames}
      >
        {buildMenu(menuConfig)}
      </AccordionMenu>
    </div>
  );
}
